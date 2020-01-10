import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export enum DateOptionValueType {
  PresetValue,
  CustomRange
}

export interface DateOption {
  type: DateOptionValueType;
  displayLabel?: string | number;
  value?: DateRangeValue;
}

export interface DateRangeValue {
  start?: Date;
  end?: Date;
}

@Component({
  selector: 'campus-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  // Expose enum to template
  protected dateOptionValueType = DateOptionValueType;

  protected selectedDateOption: FormControl = new FormControl();
  protected customRangeStartDate: FormControl = new FormControl();
  protected customRangeEndDate: FormControl = new FormControl();

  protected dateOptions: DateOption[];

  @Input()
  public buttonDisplayLabel = 'Kies een datum';

  constructor() {}

  ngOnInit() {
    this.dateOptions = [
      {
        type: DateOptionValueType.CustomRange
      }
    ];
  }

  public clickApply() {}

  public clickCancel() {}

  /**
   * Fed to the date pickers so they know which dates to highlight
   */
  public applyClassToDateInRange(date: Date) {
    const startDateValue: Date = this.customRangeStartDate.value;
    const endDateValue: Date = this.customRangeEndDate.value;

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
        return 'ui-date-range-picker__day--in-range-single';
      } else if (sameDay(date, startDateValue)) {
        return 'ui-date-range-picker__day--in-range-first';
      } else if (sameDay(date, endDateValue)) {
        return 'ui-date-range-picker__day--in-range-last';
      } else {
        return 'ui-date-range-picker__day--in-range';
      }
    } else if (
      (startDateValue && sameDay(date, startDateValue)) ||
      (endDateValue && sameDay(date, endDateValue))
    ) {
      return 'ui-date-range-picker__day--in-range-single';
    }
  }
}
