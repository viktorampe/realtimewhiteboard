import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface
} from '../../interfaces';

@Component({
  selector: 'campus-checkbox-line-filter',
  templateUrl: './checkbox-line-filter-component.html',
  styleUrls: ['./checkbox-line-filter-component.scss']
})
export class CheckboxLineFilterComponent
  implements SearchFilterComponentInterface {
  public filteredFilterCriteria: SearchFilterCriteriaInterface;
  private _filterCriteria: SearchFilterCriteriaInterface;

  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  >();

  @Input()
  get filterCriteria(): SearchFilterCriteriaInterface {
    return this._filterCriteria;
  }
  set filterCriteria(value: SearchFilterCriteriaInterface) {
    if (this._filterCriteria === value) return;

    this._filterCriteria = value;
    this.filteredFilterCriteria = this.getFilteredCriterium(value);
  }

  @HostBinding('class.checkbox-line-filter-component')
  get isCheckboxLineFilterClass() {
    return true;
  }

  public getDisplayValue(value: any): string {
    return (
      value.data[this.filterCriteria.displayProperty] +
      (value.prediction ? '(' + value.prediction + ')' : '')
    );
  }

  //todo change any with actual interface
  itemChanged(value: any) {
    value.selected = !value.selected;
    this.filterSelectionChange.emit(this.filterCriteria);
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
