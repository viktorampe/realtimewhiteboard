import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCalendar } from '@angular/material';
import { DateFunctions } from '@campus/utils';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces/search-filter-criteria.interface';

interface SelectOption {
  value: SearchFilterCriteriaValuesInterface;
  viewValue: string | number;
}

@Component({
  selector: 'campus-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent
  implements SearchFilterComponentInterface, OnInit, OnDestroy {
  criteria: SearchFilterCriteriaInterface;
  options: SelectOption[];
  selectControl: FormControl = new FormControl();
  startDate: FormControl = new FormControl();
  endDate: FormControl = new FormControl();
  count = 0;
  customDisplayLabel: string;

  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatCalendar) child: MatCalendar<Date>;

  @Input() resetLabel: string;
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

  constructor(private ref: ElementRef, private overlay: Overlay) {}

  ngOnInit() {
    this.subscriptions.add(
      this.selectControl.valueChanges.pipe(distinctUntilChanged()).subscribe(
        (selection: SearchFilterCriteriaValuesInterface): void => {
          this.criteria.values = selection
            ? [selection]
            : ([] as SearchFilterCriteriaValuesInterface[]);

          this.startDate.setValue(null, { emitEvent: false });
          this.endDate.setValue(null, { emitEvent: false });
          this.customDisplayLabel = null;

          this.updateView();
          this.filterSelectionChange.emit([this.criteria]);
        }
      )
    );

    this.subscriptions.add(
      this.startDate.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(this.onDateChange.bind(this))
    );

    this.subscriptions.add(
      this.endDate.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(this.onDateChange.bind(this))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateView(): void {
    this.count = this.criteria.values.length;
  }

  private onDateChange() {
    const startDateValue: Date =
      this.startDate.value && new Date(this.startDate.value);
    const endDateValue: Date =
      this.endDate.value && new Date(this.endDate.value);

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

      this.criteria.values = [
        {
          data: {
            gte: startDateValue,
            lte: endDateValue
          }
        }
      ];

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
      this.criteria.values = [];
      this.customDisplayLabel = null;
    }

    this.updateView();
    this.filterSelectionChange.emit([this.criteria]);
  }

  private getSelectOptions(): SelectOption[] {
    const now = new Date();

    return [
      {
        viewValue: 'Deze week',
        value: {
          data: {
            gte: DateFunctions.startOfWeek(now),
            lte: DateFunctions.endOfWeek(now)
          }
        }
      },
      {
        viewValue: 'Vorige week',
        value: {
          data: {
            gte: DateFunctions.lastWeek(now),
            lte: DateFunctions.endOfWeek(DateFunctions.lastWeek(now))
          }
        }
      }
    ];
  }
}
