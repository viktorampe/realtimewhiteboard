import { SearchFilterComponentInterface } from './search-filter-component-interface';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';

export interface SearchFilter<T, K> {
  criteria:
    | SearchFilterCriteriaInterface<T, K>
    | SearchFilterCriteriaInterface<T, K>[];
  component: SearchFilterComponentInterface<T, K>;
  domHost: string;
  options?: any;
}

export interface SearchFilterFactory {
  getFilters(SearchStateInterface: FilterCriteria[]): SearchFilter[];
}
