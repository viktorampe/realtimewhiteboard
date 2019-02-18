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

  onFilterSelectionChange(
    keyProperty: string,
    filterCriterion: SearchFilterCriteriaInterface
  ) {
    console.log(keyProperty);
    console.log(filterCriterion);
    // const returnFilterCriterion: SearchFilterCriteriaInterface;
    filterCriterion.values = filterCriterion.values.map(value => {
      value.data[filterCriterion.keyProperty] === keyProperty
        ? (value.selected = true)
        : (value.selected = false);
      // if (value.selected && value.child) returnFilterCriterion = value.child;
      return { ...value };
    });
    this.filterSelectionChange.emit([filterCriterion]);
  }
}
