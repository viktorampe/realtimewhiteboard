import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
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
  selector: 'campus-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public set filterCriteria(criteria: SearchFilterCriteriaInterface) {
    this.criteria = criteria;
    this.options = this.criteriaToOptions(criteria);
    const selection = this.options
      .filter(option => option.value.selected)
      .map(option => option.value);
    this.updateView(selection);
  }
  public get filterCriteria() {
    return this.criteria;
  }

  @Output() filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface[]
  > = new EventEmitter();

  @HostBinding('class.select-filter-component')
  selectFilterComponentClass = true;

  constructor(@Inject(ChangeDetectorRef) private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.add(
      this.selectControl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(
          (
            selection:
              | SearchFilterCriteriaValuesInterface
              | SearchFilterCriteriaValuesInterface[]
          ): void => {
            if (Array.isArray(selection)) {
              // multiple === true
              if (selection.includes(null)) {
                // resetLabel was clicked
                this.selectControl.setValue([]);
                return;
              }
            } else {
              selection = selection === null ? [] : [selection];
            }
            this.updateView(selection);
            this.updateCriteriaWithSelected(this.criteria.values, selection);
            this.filterSelectionChange.emit([this.criteria]);
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public reset(emit = true) {
    this.selectControl.reset(undefined, { emitEvent: emit });
    if (!emit) this.updateView(); // emit -> updateView called in valueChanges
  }

  private criteriaToOptions(
    criteria: SearchFilterCriteriaInterface
  ): SelectOption[] {
    return criteria.values
      .filter(value => value.visible)
      .map(
        (value: SearchFilterCriteriaValuesInterface): SelectOption => {
          let viewValue = value.data[criteria.displayProperty];
          if (value.prediction !== undefined) {
            viewValue += ' (' + value.prediction + ')';
          }
          return { value, viewValue };
        }
      );
  }

  private updateView(selection?: SearchFilterCriteriaValuesInterface[]): void {
    this.count = Array.isArray(selection) ? selection.length : 0;

    if (selection) {
      if (this.multiple) {
        this.selectControl.setValue(selection);
      } else {
        this.selectControl.setValue(selection[0] || null);
      }
    }
    this.cd.markForCheck();
  }

  private updateCriteriaWithSelected(
    values: SearchFilterCriteriaValuesInterface[],
    selection: SearchFilterCriteriaValuesInterface[]
  ): void {
    // uncheck everything
    values.forEach(value => {
      value.selected = false;
    });
    // then check selected
    selection.forEach(selected => {
      selected.selected = true;
    });
  }
}
