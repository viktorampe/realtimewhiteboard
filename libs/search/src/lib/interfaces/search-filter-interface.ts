import { SearchFilterComponentInterface } from './search-filter-component-interface';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';

export interface SearchFilter {
  criteria:
    | SearchFilterCriteriaInterface<unknown, unknown>
    | SearchFilterCriteriaInterface<unknown, unknown>[];
  component: SearchFilterComponentInterface<unknown, unknown>;
  domHost: string;
  options?: any;
}

export interface SearchFilterFactory {
  getFilters(SearchStateInterface: FilterCriteria[]): SearchFilter[];
}
