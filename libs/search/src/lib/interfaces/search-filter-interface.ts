import { SearchFilterComponentInterface } from './search-filter-component-interface';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';
import { SearchStateInterface } from './search-state.interface';

export interface SearchFilter {
  criteria:
    | SearchFilterCriteriaInterface<unknown, any>
    | SearchFilterCriteriaInterface<unknown, any>[];
  component: SearchFilterComponentInterface<unknown, any>;
  domHost: string;
  options?: any;
}

export interface SearchFilterFactory {
  getFilters(searchState: SearchStateInterface<unknown>[]): SearchFilter[];
}
