import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger, MAT_DATE_LOCALE } from '@angular/material';
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

export interface DateFilterComponentFormValues {
  dateSelection?: RadioOptionValue;
  startDate?: Date;
  endDate?: Date;
}

@Component({
  selector: 'campus-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent
  implements SearchFilterComponentInterface, OnInit, OnDestroy {
  criteria: SearchFilterCriteriaInterface;
  radioOptions: RadioOption[];
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
  private formValues: DateFilterComponentFormValues = {};
  private fixedOptions: RadioOption[] = [];

  @ViewChild(MatMenuTrigger)
  matMenuTrigger: MatMenuTrigger;

  @Input()
  public set resetLabel(label: string) {
    this.resetOptionLabel = label;
    this.radioOptions = this.getRadioOptions();
  }
  public get resetLabel() {
    return this.resetOptionLabel;
  }

  @Input()
  public set options(options: RadioOption[]) {
    this.fixedOptions = options;
    this.radioOptions = this.getRadioOptions();
  }
  public get options() {
    return this.fixedOptions;
  }

  @Input()
  public set filterCriteria(criteria: SearchFilterCriteriaInterface) {
    this.criteria = criteria;
  }
  public get filterCriteria() {
    return this.criteria;
  }

  @Output() filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface[]
  > = new EventEmitter();

  @HostBinding('class.date-filter-component')
  dateFilterComponentClass = true;

  constructor(@Inject(MAT_DATE_LOCALE) private locale: string) {}

  ngOnInit() {
    this.subscriptions.add(
      this.matMenuTrigger.menuClosed.subscribe(this.cancelFormValues.bind(this))
    );

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
    if (cancel) {
      this.matMenuTrigger.closeMenu();
      return;
    }

    // Order is important here, must store values before closing the mat-menu
    this.storeFormValues();

    this.filterSelectionChange.emit([this.criteria]);
    this.updateView();

    this.matMenuTrigger.closeMenu();
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
          formatDate(startDateValue, 'd/MM/yy', this.locale) +
          ' tot en met ' +
          formatDate(endDateValue, 'd/MM/yy', this.locale);
      } else if (startDateValue) {
        this.customDisplayLabel =
          'Vanaf ' + formatDate(startDateValue, 'd/MM/yy', this.locale);
      } else if (endDateValue) {
        this.customDisplayLabel =
          'Tot en met ' + formatDate(endDateValue, 'd/MM/yy', this.locale);
      }
    } else {
      this.customDisplayLabel = null;
    }

    const hasDates: boolean =
      !!this.criteria.values.length &&
      !!this.criteria.values[0] &&
      !!(this.criteria.values[0].data.gte || this.criteria.values[0].data.lte);

    this.count = +hasDates;
  }

  public reset(): void {
    this.dateSelection.setValue({}, { emitEvent: false });
    this.filterCriteria.values = [{ data: {} }];
    this.filterSelectionChange.next([this.filterCriteria]);
    this.updateView();
  }

  private storeFormValues(): void {
    this.formValues = {
      dateSelection: this.dateSelection.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value
    };
  }

  private cancelFormValues(): void {
    this.dateSelection.setValue(this.formValues.dateSelection, {
      emitEvent: false
    });
    this.startDate.setValue(this.formValues.startDate, {
      emitEvent: false
    });
    this.endDate.setValue(this.formValues.endDate, { emitEvent: false });
  }

  private getRadioOptions(): RadioOption[] {
    let options = this.fixedOptions;

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
