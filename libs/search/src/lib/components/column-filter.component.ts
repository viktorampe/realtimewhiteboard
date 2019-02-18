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
  @Input() filterCriteria:
    | SearchFilterCriteriaInterface
    | SearchFilterCriteriaInterface[];
  @Output()
  filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  >();
  constructor() {}

  onFilterSelectionChange(keyProperty) {
    console.log(keyProperty);
    this.filterSelectionChange.emit(this.filterCriteria);
  }
}
