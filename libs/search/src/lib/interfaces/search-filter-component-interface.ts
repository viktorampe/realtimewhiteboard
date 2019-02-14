import { EventEmitter } from '@angular/core';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';

export interface SearchFilterComponentInterface<T, K> {
  filterCriteria: SearchFilterCriteriaInterface<T, K>;
  filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface<T, K> | SearchFilterCriteriaInterface<T, K>[]
  >;
}
