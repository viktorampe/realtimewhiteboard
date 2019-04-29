import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchFilterComponentInterface } from './search-filter-component-interface';
import { SearchFilterCriteriaInterface } from './search-filter-criteria.interface';
import { SearchStateInterface } from './search-state.interface';

export interface SearchFilterInterface {
  criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[];
  component: Type<SearchFilterComponentInterface>;
  domHost: string;
  options?: any;
}

export interface SearchFilterFactory {
  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]>;

  getPredictionFilterNames(searchState: SearchStateInterface): string[];
}
