import { Component, Input } from '@angular/core';
import { SearchFilterCriteriaInterface } from '../../../interfaces';

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
    this.filteredFilterCriterium = this.getFilteredCriterium(value);
  }

  // expand aantal zichtbare titels bij CHILD
  public showMore(value: boolean) {
    this.showMoreItems = value;
  }

  private getFilteredCriterium(
    criterium: SearchFilterCriteriaInterface
  ): SearchFilterCriteriaInterface {
    return {
      ...criterium,
      ...{
        values: criterium.values
          .filter(value => value.visible && value.prediction !== 0)
          // order by selected status
          // needed so selected values aren't hidden
          .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1))
      }
    };
  }
}
