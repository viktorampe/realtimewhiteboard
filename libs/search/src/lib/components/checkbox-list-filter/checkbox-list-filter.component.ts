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
    if (this.filterCriteria instanceof Array) {
      this.hasPredictions = this.filterCriteria.some(criterium =>
        criterium.values.some(value => !!value.prediction)
      );
    } else {
      this.hasPredictions = this.filterCriteria.values.some(
        value => !!value.prediction
      );
    }
  }

  public onSelectionChange() {
    // wait for changes to propagate through entire structure
    setTimeout(() => {
      this.filterSelectionChange.emit([this.filterCriteria]);
    });
  }
}
