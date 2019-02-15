import { EventEmitter } from '@angular/core';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';

export interface SearchFilterComponentInterface {
  filterCriteria:
    | SearchFilterCriteriaInterface
    | SearchFilterCriteriaInterface[];
  filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  >;
}
