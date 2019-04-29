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
  public maxVisibleItems = 0; // 0 == no limit

  @Input() filterCriteria: SearchFilterCriteriaInterface;
  @Input() public sortBySelection = false;

  @Input()
  public set filterOptions(value: any) {
    if (value && value.maxVisibleItems) {
      this.maxVisibleItems = value.maxVisibleItems;
    }
  }
  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();

  public onSelectionChange() {
    // wait for changes to propagate through entire structure
    setTimeout(() => {
      this.filterSelectionChange.emit([this.filterCriteria]);
    });
  }
}
