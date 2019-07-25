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
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces/search-filter-criteria.interface';

interface ButtonOption {
  value: SearchFilterCriteriaValuesInterface;
  viewValue: string;
  tooltip: string;
}

@Component({
  selector: 'campus-button-toggle-filter',
  templateUrl: './button-toggle-filter.component.html',
  styleUrls: ['./button-toggle-filter.component.css']
})
export class ButtonToggleFilterComponent
  implements SearchFilterComponentInterface, OnInit, OnDestroy {
  criteria: SearchFilterCriteriaInterface;
  options: ButtonOption[];
  toggleControl: FormControl = new FormControl();

  private subscriptions: Subscription = new Subscription();

  @Input() multiple = false;
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

  @Input()
  public set filterOptions(value: any) {
    if (value && value.multiple) {
      this.multiple = value.multiple;
    }
  }

  @Output() filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface[]
  > = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.subscriptions.add(
      this.toggleControl.valueChanges.pipe(distinctUntilChanged()).subscribe(
        (
          selection:
            | SearchFilterCriteriaValuesInterface
            | SearchFilterCriteriaValuesInterface[]
        ): void => {
          if (!Array.isArray(selection)) {
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

  private criteriaToOptions(
    criteria: SearchFilterCriteriaInterface
  ): ButtonOption[] {
    return criteria.values
      .filter(value => value.visible)
      .map(
        (value: SearchFilterCriteriaValuesInterface): ButtonOption => {
          const viewValue = value.data[criteria.displayProperty];
          const tooltip = this.getToolTip(value);
          return { value, viewValue, tooltip };
        }
      );
  }

  private updateView(selection: SearchFilterCriteriaValuesInterface[]): void {
    if (this.multiple) {
      this.toggleControl.setValue(selection);
    } else {
      this.toggleControl.setValue(selection[0] || null);
    }
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

  private getToolTip(value: SearchFilterCriteriaValuesInterface): string {
    if (!value.prediction) {
      return '';
    } else {
      if (value.prediction === 1) {
        return '1 resultaat';
      } else {
        return value.prediction + ' resultaten';
      }
    }
  }
}
