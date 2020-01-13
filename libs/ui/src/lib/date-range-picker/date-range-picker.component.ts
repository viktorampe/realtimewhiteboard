import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateTimeRangeValidator } from '@campus/utils';
import { Subscription } from 'rxjs';

export interface DateRangeValue {
  start?: Date;
  end?: Date;
}

@Component({
  selector: 'campus-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit, OnChanges, OnDestroy {
  // Is the start date and time required?
  @Input()
  public requireStart = true;

  // Is the end date and time required?
  @Input()
  public requireEnd = true;

  // Are time input fields used?
  @Input()
  public useTime = true;

  // Should there be a vertical layout for the two range controls?
  @Input()
  public vertical = false;

  @Input()
  public initialStartDate: Date = null;

  @Input()
  public initialStartTime: string = null;

  @Input()
  public initialEndDate: Date = null;

  @Input()
  public initialEndTime: string = null;

  @Output()
  public valueChanged = new EventEmitter<DateRangeValue>();

  public dateRangeForm: FormGroup;

  private subscriptions: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.setupForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // These changes require the formgroup to be recreated
    if (
      changes.requireStart ||
      changes.requireEnd ||
      changes.useTime ||
      changes.initialStartDate ||
      changes.initialStartTime ||
      changes.initialEndDate ||
      changes.initialEndTime
    ) {
      this.subscriptions.unsubscribe();
      this.setupForm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setupForm() {
    const startDateValidators = this.requireStart ? [Validators.required] : [];
    const startTimeValidators =
      this.useTime && this.requireStart ? [Validators.required] : [];
    const endDateValidators = this.requireEnd ? [Validators.required] : [];
    const endTimeValidators =
      this.useTime && this.requireEnd ? [Validators.required] : [];

    this.dateRangeForm = this.formBuilder.group(
      {
        startDate: [this.initialStartDate, ...startDateValidators],
        startTime: [this.initialStartTime, ...startTimeValidators],
        endDate: [this.initialEndDate, ...endDateValidators],
        endTime: [this.initialEndTime, ...endTimeValidators]
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

    this.subscriptions.add(
      this.dateRangeForm.valueChanges.subscribe(values => {
        if (this.dateRangeForm.valid) {
          this.emitFormValues(values);
        }
      })
    );
  }

  private emitFormValues(values: any) {
    // Incorporate the times into the dates to create the final value
    // Dates can be optional, so they could be null
    const fullStartDate = values.startDate ? new Date(values.startDate) : null;
    const fullEndDate = values.endDate ? new Date(values.endDate) : null;

    const applyTimeToDate = (time: string, date: Date) => {
      // Times can be optional, so we default to zero if we don't have a time
      const splitTime = time ? time.split(':') : [0, 0];

      // Time input values are strings of the format HH:mm:ss.sss, see:
      // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#times

      date.setHours(+splitTime[0]);
      date.setMinutes(+splitTime[1]);
    };

    if (fullStartDate) {
      applyTimeToDate(values.startTime, fullStartDate);
    }

    if (fullEndDate) {
      applyTimeToDate(values.endTime, fullEndDate);
    }

    const result: DateRangeValue = {
      start: fullStartDate,
      end: fullEndDate
    };

    this.valueChanged.emit(result);
  }

  /**
   * Fed to the date pickers so they know which dates to highlight
   *
   * @param date The current date the datePicker is iterating over
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
