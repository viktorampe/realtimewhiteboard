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
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { dateTimeRangeValidator } from '@campus/utils';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface DateRangeValue {
  start?: Date;
  end?: Date;
}

interface DateRangeFormValues {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
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
    if (this.dateRangeForm) {
      if (changes.requireStart || changes.requireEnd || changes.useTime) {
        const validators = this.getValidators();
        this.applyValidators(validators);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getValidators() {
    const startDateValidators = this.requireStart ? [Validators.required] : [];
    const startTimeValidators =
      this.useTime && this.requireStart ? [Validators.required] : [];
    const endDateValidators = this.requireEnd ? [Validators.required] : [];
    const endTimeValidators =
      this.useTime && this.requireEnd ? [Validators.required] : [];

    return {
      startDateValidators,
      startTimeValidators,
      endDateValidators,
      endTimeValidators
    };
  }

  private applyValidators(validators: {
    startDateValidators: ValidatorFn[];
    startTimeValidators: ValidatorFn[];
    endDateValidators: ValidatorFn[];
    endTimeValidators: ValidatorFn[];
  }) {
    this.dateRangeForm
      .get('startDate')
      .setValidators(validators.startDateValidators);
    this.dateRangeForm
      .get('startTime')
      .setValidators(validators.startTimeValidators);
    this.dateRangeForm
      .get('endDate')
      .setValidators(validators.endDateValidators);
    this.dateRangeForm
      .get('endTime')
      .setValidators(validators.endTimeValidators);
  }

  private setupForm() {
    const validators = this.getValidators();

    this.dateRangeForm = this.formBuilder.group(
      {
        startDate: [this.initialStartDate, [...validators.startDateValidators]],
        startTime: [this.initialStartTime, [...validators.startTimeValidators]],
        endDate: [this.initialEndDate, [...validators.endDateValidators]],
        endTime: [this.initialEndTime, [...validators.endTimeValidators]]
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
      this.dateRangeForm.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((values: DateRangeFormValues) => {
          if (this.dateRangeForm.valid) {
            this.emitFormValues(values);
          }
        })
    );
  }

  private emitFormValues(values: DateRangeFormValues) {
    // Incorporate the times into the dates to create the final value
    // Dates can be optional, so they could be null
    const fullStartDate = values.startDate ? new Date(values.startDate) : null;
    const fullEndDate = values.endDate ? new Date(values.endDate) : null;

    if (fullStartDate) {
      this.applyTimeToDate(values.startTime, fullStartDate);
    }

    if (fullEndDate) {
      this.applyTimeToDate(values.endTime, fullEndDate);
    }

    const result: DateRangeValue = {
      start: fullStartDate,
      end: fullEndDate
    };

    this.valueChanged.emit(result);
  }

  private applyTimeToDate(time: string, date: Date) {
    // Times can be optional, so we default to zero if we don't have a time
    const splitTime = time ? time.split(':') : [0, 0];

    // Time input values are strings of the format HH:mm:ss.sss, see:
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#times

    date.setHours(+splitTime[0]);
    date.setMinutes(+splitTime[1]);
  }

  private isSameDay(a: Date, b: Date) {
    if (!a || !b) {
      return false;
    } else {
      return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
      );
    }
  }

  /**
   * Fed to the date pickers so they know which dates to highlight
   *
   * @param date The current date the datePicker is iterating over
   */
  public applyClassToDateInRange(date: Date) {
    const startDateValue: Date = this.dateRangeForm.get('startDate').value;
    const endDateValue: Date = this.dateRangeForm.get('endDate').value;

    const isFirstOfRange = this.isSameDay(date, startDateValue);
    const isLastOfRange = this.isSameDay(date, endDateValue);

    if (
      startDateValue &&
      endDateValue &&
      date >= startDateValue &&
      date <= endDateValue
    ) {
      if (isFirstOfRange && isLastOfRange) {
        return 'ui-date-range-picker__day--in-range-single';
      } else if (isFirstOfRange) {
        return 'ui-date-range-picker__day--in-range-first';
      } else if (isLastOfRange) {
        return 'ui-date-range-picker__day--in-range-last';
      } else {
        return 'ui-date-range-picker__day--in-range';
      }
    } else if (
      (startDateValue && isFirstOfRange) ||
      (endDateValue && isLastOfRange)
    ) {
      return 'ui-date-range-picker__day--in-range-single';
    }
  }
}
