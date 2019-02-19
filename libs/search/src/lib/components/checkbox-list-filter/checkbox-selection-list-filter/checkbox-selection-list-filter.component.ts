import { Component, Input } from '@angular/core';
import { SearchFilterCriteriaInterface } from '../../../interfaces';
import { getFilteredCriterium } from '../checkbox-list-filter.component';

@Component({
  selector: 'campus-checkbox-selection-list-filter',
  templateUrl: './checkbox-selection-list-filter.component.html',
  styleUrls: ['./checkbox-selection-list-filter.component.scss']
})
export class CheckboxSelectionListFilterComponent {
  public showMoreItems: boolean; // expand aantal zichtbare titels
  public filteredFilterCriterium: SearchFilterCriteriaInterface;

  private _criterium: SearchFilterCriteriaInterface;

  @Input() maxVisibleItems: number; // aantal zichtbare titels

  @Input()
  get criterium(): SearchFilterCriteriaInterface {
    return this._criterium;
  }
  set criterium(value: SearchFilterCriteriaInterface) {
    if (this._criterium === value) return;

    this._criterium = value;
    this.filteredFilterCriterium = getFilteredCriterium(value);
  }

  // expand aantal zichtbare titels bij CHILD
  public showMore(value: boolean) {
    this.showMoreItems = value;
  }
}
