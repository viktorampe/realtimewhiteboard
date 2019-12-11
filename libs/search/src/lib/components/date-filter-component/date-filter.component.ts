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

enum SelectOptionValueType {
  FilterCriteriaValue,
  CustomRange,
  NoFilter
}

interface SelectOption {
  value: SelectOptionValue;
  viewValue: string | number;
}

interface SelectOptionValue {
  type: SelectOptionValueType;
  contents?: SearchFilterCriteriaValuesInterface;
}

@Component({
  selector: 'campus-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent
  implements SearchFilterComponentInterface, OnInit, OnDestroy {
  SelectOptionValueType = SelectOptionValueType;

  criteria: SearchFilterCriteriaInterface;
  options: SelectOption[];
  selectControl: FormControl = new FormControl();
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
    this.options = this.getSelectOptions();
  }
  public get resetLabel() {
    return this.resetOptionLabel;
  }

  @Input()
  public set filterCriteria(criteria: SearchFilterCriteriaInterface) {
    this.criteria = criteria;
    this.options = this.getSelectOptions();
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
        .subscribe((optionValue: SelectOptionValue) => {
          switch (optionValue.type) {
            case SelectOptionValueType.CustomRange:
              this.startDate.enable({ emitEvent: false });
              this.endDate.enable({ emitEvent: false });

              // Trigger it ourselves to prevent two consecutive date
              // change events from firing when both inputs are enabled
              this.onDateChange();
              break;
            case SelectOptionValueType.FilterCriteriaValue:
              this.startDate.disable({ emitEvent: false });
              this.endDate.disable({ emitEvent: false });

              this.filterCriteria.values = [optionValue.contents];
              break;
            default:
              this.filterCriteria.values = [];
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

    this.startDate.disable({ emitEvent: false });
    this.endDate.disable({ emitEvent: false });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public applyFilter(cancel: boolean): void {
    this.matMenuTrigger.closeMenu();

    if (cancel) {
      return;
    }

    this.filterSelectionChange.emit([this.criteria]);
    this.updateView();
  }

  public applyClassToDateInRange(date: Date) {
    const startDateValue: Date = this.startDate.value;
    const endDateValue: Date = this.endDate.value;

    if (
      startDateValue &&
      endDateValue &&
      date >= startDateValue &&
      date <= endDateValue
    ) {
      return 'date-filter-component__select-panel__date-range__day--in-range';
    }
  }

  private updateView(): void {
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

    this.count = this.criteria.values.length;
  }

  private onDateChange(trigger?: FormControl) {
    let startDateValue: Date =
      this.startDate.value && new Date(this.startDate.value);
    let endDateValue: Date = this.endDate.value && new Date(this.endDate.value);

    // clear the selection (visual) and don't trigger our own handler
    this.selectControl.setValue(null, { emitEvent: false });

    // startDate or endDate can be null if it's an invalid date
    if (startDateValue || endDateValue) {
      // normalize the times to actually be the very start or end of the day
      if (startDateValue) {
        startDateValue.setHours(0, 0, 0, 0);
      }

      if (endDateValue) {
        endDateValue.setHours(23, 59, 59, 999);
      }

      if (startDateValue && endDateValue) {
        // If we pick an end date lower than the start date, the start date becomes the end date
        if (trigger === this.endDate && endDateValue < startDateValue) {
          startDateValue = endDateValue;
          this.startDate.setValue(startDateValue, { emitEvent: false });
        }

        // If we pick a start date higher than the end date, the end date becomes the start date
        if (trigger === this.startDate && startDateValue > endDateValue) {
          endDateValue = startDateValue;
          this.endDate.setValue(endDateValue, { emitEvent: false });
        }
      }

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
      this.customDisplayLabel = null;
    }
  }

  private getSelectOptions(): SelectOption[] {
    const now = new Date();
    let options: SelectOption[] = [
      {
        viewValue: 'Deze week',
        value: {
          type: SelectOptionValueType.FilterCriteriaValue,
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
          type: SelectOptionValueType.FilterCriteriaValue,
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
            type: SelectOptionValueType.NoFilter
          }
        },
        ...options
      ];
    }

    return options;
  }
}
