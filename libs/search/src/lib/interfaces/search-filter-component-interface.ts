import { EventEmitter } from '@angular/core';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';

export interface SearchFilterComponentInterface<
  T,
  K extends SearchFilterCriteriaInterface<unknown, any> | null
> {
  filterCriteria:
    | SearchFilterCriteriaInterface<T, K>
    | SearchFilterCriteriaInterface<T, K>[];
  filterSelectionChange: EventEmitter<
    SearchFilterCriteriaInterface<T, K> | SearchFilterCriteriaInterface<T, K>[]
  >;
}
