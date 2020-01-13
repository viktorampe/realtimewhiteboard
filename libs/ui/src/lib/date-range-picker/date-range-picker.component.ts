import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateTimeRangeValidator } from '@campus/utils';

@Component({
  selector: 'campus-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  protected dateRangeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.dateRangeForm = this.formBuilder.group(
      {
        startDate: [null, Validators.required],
        startTime: [null, Validators.required],
        endDate: [null, Validators.required],
        endTime: [null, Validators.required]
      },
      {
        validators: dateTimeRangeValidator(
          'startDate',
          'startTime',
          'endDate',
          'endTime'
        )
      }
    );

    this.dateRangeForm.valueChanges.subscribe(v => {
      if (this.dateRangeForm.valid) {
        console.log(v);
      }
    });
  }

  /**
   * Fed to the date pickers so they know which dates to highlight
   */
  public applyClassToDateInRange(date: Date) {
    const startDateValue: Date = this.dateRangeForm.get('startDate').value;
    const endDateValue: Date = this.dateRangeForm.get('endDate').value;

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
