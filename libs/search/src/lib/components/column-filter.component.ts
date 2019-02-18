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
    const returnFilterCriterion = { ...filterCriterion };
    returnFilterCriterion.values = filterCriterion.values.map(value => {
      const returnValue = { ...value };
      if (value.data[filterCriterion.keyProperty] === keyProperty)
        returnValue.selected = true;
      else returnValue.selected = false;
      return returnValue;
    });
    console.log(returnFilterCriterion);
    this.filterSelectionChange.emit(returnFilterCriterion);
  }
}
