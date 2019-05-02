import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces';

@Component({
  selector: 'campus-checkbox-line-filter',
  templateUrl: './checkbox-line-filter-component.html',
  styleUrls: ['./checkbox-line-filter-component.scss']
})
export class CheckboxLineFilterComponent
  implements SearchFilterComponentInterface {
  public filteredFilterCriteria: SearchFilterCriteriaInterface;
  public hasPredictions = false;
  private _filterCriteria: SearchFilterCriteriaInterface;

  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface[]
  >();

  @Input()
  public set filterCriteria(value: SearchFilterCriteriaInterface) {
    this._filterCriteria = value;
    this.filteredFilterCriteria = this.getFilteredCriterium(value);
  }
  public get filterCriteria(): SearchFilterCriteriaInterface {
    return this._filterCriteria;
  }

  @HostBinding('class.checkbox-line-filter-component')
  get isCheckboxLineFilterClass() {
    return true;
  }

  public getDisplayValue(value: SearchFilterCriteriaValuesInterface): string {
    return value.data[this.filterCriteria.displayProperty];
  }

  public itemChanged(value: SearchFilterCriteriaValuesInterface) {
    value.selected = !value.selected;
    this.filterSelectionChange.emit([this.filterCriteria]);
  }

  private getFilteredCriterium(
    criterium: SearchFilterCriteriaInterface
  ): SearchFilterCriteriaInterface {
    return {
      ...criterium,
      ...{
        values: criterium.values.filter(value => value.visible)
      }
    };
  }
}
