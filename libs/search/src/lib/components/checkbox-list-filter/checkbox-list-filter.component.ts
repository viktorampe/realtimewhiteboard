import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces';
import { SearchFilterCriteriaInterface } from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent
  implements SearchFilterComponentInterface, OnInit {
  public showMoreChildren = false;
  public maxVisibleItems = 0; // 0 == no limit
  public hasPredictions = false;

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

  ngOnInit() {
    this.calculateHasPredictions();
  }

  private calculateHasPredictions() {
    this.hasPredictions = this.checkVisible(this.filterCriteria.values);
  }

  private checkVisible(values) {
    return values.some(value => {
      if (!!value.prediction || value.selected) {
        return true;
      }
      if (value.child) {
        return this.checkVisible(value.child.values);
      }
      return false;
    });
  }

  public onSelectionChange() {
    // wait for changes to propagate through entire structure
    setTimeout(() => {
      this.filterSelectionChange.emit([this.filterCriteria]);
    });
  }
}
