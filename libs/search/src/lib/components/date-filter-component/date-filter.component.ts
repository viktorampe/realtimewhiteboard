import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { DateFunctions } from '@campus/utils';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces/search-filter-criteria.interface';

export enum RadioOptionValueType {
  FilterCriteriaValue,
  CustomRange,
  NoFilter
}

export interface RadioOption {
  value: RadioOptionValue;
  viewValue: string | number;
}

export interface RadioOptionValue {
  type: RadioOptionValueType;
  contents?: SearchFilterCriteriaValuesInterface;
}

@Component({
  selector: 'campus-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent
  implements SearchFilterComponentInterface, OnInit, OnDestroy {
  RadioOptionValueType = RadioOptionValueType;

  criteria: SearchFilterCriteriaInterface;
  options: RadioOption[];
  customRangeOptionValue: RadioOptionValue = {
    type: RadioOptionValueType.CustomRange
  };
  startDate: FormControl = new FormControl();
  endDate: FormControl = new FormControl();
  dateSelection: FormControl = new FormControl();
  count = 0;
  customDisplayLabel: string;
  resetOptionLabel: string;

  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;

  @Input()
  public set resetLabel(label: string) {
    this.resetOptionLabel = label;
    this.options = this.getRadioOptions();
  }
  public get resetLabel() {
    return this.resetOptionLabel;
  }

  @Input()
  public set filterCriteria(criteria: SearchFilterCriteriaInterface) {
    this.criteria = criteria;
    this.options = this.getRadioOptions();
  }
  public get filterCriteria() {
    return this.criteria;
  }

  @Output() filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface[]
  > = new EventEmitter();

  @HostBinding('class.date-filter-component')
  dateFilterComponentClass = true;

  constructor() {}

  ngOnInit() {
    this.subscriptions.add(
      this.dateSelection.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((optionValue: RadioOptionValue) => {
          switch (optionValue.type) {
            case RadioOptionValueType.CustomRange:
              // Trigger it ourselves to prevent two consecutive date
              // change events from firing when both inputs are enabled
              this.onDateChange();
              break;
            case RadioOptionValueType.FilterCriteriaValue:
              this.criteria.values = [optionValue.contents];
              break;
            default:
              this.criteria.values = [];
              break;
          }
        })
    );

    this.subscriptions.add(
      this.startDate.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(this.onDateChange.bind(this, this.startDate))
    );

    this.subscriptions.add(
      this.endDate.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(this.onDateChange.bind(this, this.endDate))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public applyFilter(cancel?: boolean): void {
    this.matMenuTrigger.closeMenu();

    if (cancel) {
      return;
    }

    this.filterSelectionChange.emit([this.criteria]);
    this.updateView();
  }

  public clickDateInput() {
    this.dateSelection.setValue(this.customRangeOptionValue);
  }

  /**
   * Fed to the date pickers so they know which dates to highlight
   */
  public applyClassToDateInRange(date: Date) {
    const startDateValue: Date = this.startDate.value;
    const endDateValue: Date = this.endDate.value;

    const sameDay = (a: Date, b: Date) => {
      return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
      );
    };

    if (
      startDateValue &&
      endDateValue &&
      date >= startDateValue &&
      date <= endDateValue
    ) {
      if (sameDay(date, startDateValue) && sameDay(date, endDateValue)) {
        return 'date-filter-component__menu-panel__date-range__day--in-range-single';
      } else if (sameDay(date, startDateValue)) {
        return 'date-filter-component__menu-panel__date-range__day--in-range-first';
      } else if (sameDay(date, endDateValue)) {
        return 'date-filter-component__menu-panel__date-range__day--in-range-last';
      } else {
        return 'date-filter-component__menu-panel__date-range__day--in-range';
      }
    } else if (
      (startDateValue && sameDay(date, startDateValue)) ||
      (endDateValue && sameDay(date, endDateValue))
    ) {
      return 'date-filter-component__menu-panel__date-range__day--in-range-single';
    }
  }

  public onDateChange(trigger?: FormControl) {
    let startDateValue: Date =
      this.startDate.value && new Date(this.startDate.value);
    let endDateValue: Date = this.endDate.value && new Date(this.endDate.value);

    // startDate or endDate can be null if it's an invalid date
    if (startDateValue || endDateValue) {
      if (startDateValue && endDateValue) {
        // If we pick an end date lower than the start date, the start date becomes the end date
        if (trigger === this.endDate && endDateValue < startDateValue) {
          startDateValue = new Date(endDateValue);
        }

        // If we pick a start date higher than the end date, the end date becomes the start date
        if (trigger === this.startDate && startDateValue > endDateValue) {
          endDateValue = new Date(startDateValue);
        }
      }

      // normalize the times to actually be the very start or end of the day
      if (startDateValue) {
        startDateValue.setHours(0, 0, 0, 0);
      }

      if (endDateValue) {
        endDateValue.setHours(23, 59, 59, 999);
      }

      this.startDate.setValue(startDateValue, { emitEvent: false });
      this.endDate.setValue(endDateValue, { emitEvent: false });

      this.criteria.values = [
        {
          data: {
            gte: startDateValue,
            lte: endDateValue
          }
        }
      ];
    } else {
      this.criteria.values = [];
    }
  }

  public updateView(): void {
    const startDateValue: Date =
      this.criteria.values[0] && this.criteria.values[0].data.gte;
    const endDateValue: Date =
      this.criteria.values[0] && this.criteria.values[0].data.lte;

    if (startDateValue || endDateValue) {
      if (startDateValue && endDateValue) {
        this.customDisplayLabel =
          'Vanaf ' +
          startDateValue.toLocaleDateString() +
          ' tot en met ' +
          endDateValue.toLocaleDateString();
      } else if (startDateValue) {
        this.customDisplayLabel =
          'Vanaf ' + startDateValue.toLocaleDateString();
      } else if (endDateValue) {
        this.customDisplayLabel =
          'Tot en met ' + endDateValue.toLocaleDateString();
      }
    } else {
      this.customDisplayLabel = null;
    }

    const hasDates =
      !!this.criteria.values.length &&
      !!this.criteria.values[0] &&
      (!!this.criteria.values[0].data.gte ||
        !!this.criteria.values[0].data.lte);

    this.count = +hasDates;
  }

  private getRadioOptions(): RadioOption[] {
    const now = new Date();
    let options: RadioOption[] = [
      {
        viewValue: 'Deze week',
        value: {
          type: RadioOptionValueType.FilterCriteriaValue,
          contents: {
            data: {
              gte: DateFunctions.startOfWeek(now),
              lte: DateFunctions.endOfWeek(now)
            }
          }
        }
      },
      {
        viewValue: 'Vorige week',
        value: {
          type: RadioOptionValueType.FilterCriteriaValue,
          contents: {
            data: {
              gte: DateFunctions.lastWeek(now),
              lte: DateFunctions.endOfWeek(DateFunctions.lastWeek(now))
            }
          }
        }
      }
    ];

    if (this.resetLabel) {
      options = [
        {
          viewValue: this.resetLabel,
          value: {
            type: RadioOptionValueType.NoFilter
          }
        },
        ...options
      ];
    }

    return options;
  }
}
