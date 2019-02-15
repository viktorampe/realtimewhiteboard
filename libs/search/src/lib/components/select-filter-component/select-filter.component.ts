import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';

interface SelectOption {
  value: any;
  viewValue: string | number;
}

@Component({
  selector: 'campus-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent
  implements SearchFilterComponentInterface, OnInit, OnDestroy {
  criteria: SearchFilterCriteriaInterface;
  options: SelectOption[];
  selectControl: FormControl = new FormControl();
  count = 0;

  private subscriptions: Subscription = new Subscription();

  @Input() multiple = false;
  @Input() resetLabel: string;
  @Input()
  set filterCriteria(criteria: SearchFilterCriteriaInterface) {
    this.criteria = { ...criteria };
    this.options = this.criteriaToOptions(criteria);
  }

  @Output() filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface
  > = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.subscriptions.add(
      this.selectControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(values => {
          if (!Array.isArray(values)) {
            values = [values];
          }
          if (values.includes(undefined) || values.includes(null)) {
            this.selectControl.setValue([]);
            return;
          }

          this.count = values.length;
          this.updateSelected(this.criteria.values, values);
          this.filterSelectionChange.emit(this.criteria);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private criteriaToOptions(
    criteria: SearchFilterCriteriaInterface
  ): SelectOption[] {
    return criteria.values
      .filter(value => value.visible)
      .map(
        (value): SelectOption => {
          let viewValue = value.data[criteria.displayProperty];
          if (value.prediction !== undefined) {
            viewValue += ' (' + value.prediction + ')';
          }
          return { value, viewValue };
        }
      );
  }

  private updateSelected(values, selection): void {
    if (!Array.isArray(selection)) {
      selection = [selection];
    }

    values.forEach(value => {
      value.selected = selection.includes(value);
    });
  }
}
