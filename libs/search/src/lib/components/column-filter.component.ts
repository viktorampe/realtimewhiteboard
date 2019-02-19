import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface
} from '../interfaces';

@Component({
  selector: 'campus-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss']
})
export class ColumnFilterComponent implements SearchFilterComponentInterface {
  preserveColumn = false;

  @Input() filterCriteria: SearchFilterCriteriaInterface[];
  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();
  constructor() {}

  onFilterSelectionChange(
    keyProperty: string,
    preserveColumn: boolean = false
  ) {
    this.preserveColumn = preserveColumn;
    this.filterCriteria.forEach(filterCriterion => {
      filterCriterion.values.forEach(value => {
        value.selected =
          value.data[filterCriterion.keyProperty] === keyProperty;
      });
    });
    this.filterSelectionChange.emit(this.filterCriteria);
  }
}
