import { Component, Input } from '@angular/core';
import { SearchFilterCriteriaInterface } from '../../../interfaces';

@Component({
  selector: 'campus-checkbox-selection-list-filter',
  templateUrl: './checkbox-selection-list-filter.component.html',
  styleUrls: ['./checkbox-selection-list-filter.component.scss']
})
export class CheckboxSelectionListFilterComponent {
  @Input()
  set criterium(filterCriterium: SearchFilterCriteriaInterface) {
    this.filteredFilterCriterium = {
      ...filterCriterium,
      ...{
        values: filterCriterium.values.filter(
          value => value.visible && value.prediction
        )
      }
    };
  }
  @Input() maxVisibleItems: number; // aantal zichtbare titels

  public toonMeerItems: boolean; // expand aantal zichtbare titels
  public filteredFilterCriterium: SearchFilterCriteriaInterface;

  // expand aantal zichtbare titels bij CHILD
  public toonMeer(value: boolean) {
    this.toonMeerItems = value;
  }
}
