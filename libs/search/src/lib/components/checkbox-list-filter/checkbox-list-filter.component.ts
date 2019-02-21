import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces';
import { SearchFilterCriteriaInterface } from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent
  implements SearchFilterComponentInterface {
  public showMoreChildren = false;

  @Input() maxVisibleItems = 0; // 0 == no limit
  @Input() filterCriteria: SearchFilterCriteriaInterface;

  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();

  public onSelectionChange() {
    this.filterSelectionChange.emit([this.filterCriteria]);
  }
}
