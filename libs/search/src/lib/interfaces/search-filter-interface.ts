import { SearchFilterComponentInterface } from './search-filter-component-interface';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';
import { SearchStateInterface } from './search-state.interface';

export interface SearchFilter {
  criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[];
  component: SearchFilterComponentInterface;
  domHost: string;
  options?: any;
}

export interface SearchFilterFactory {
  getFilters(searchState: SearchStateInterface[]): SearchFilter[];
}
