import { Injectable, InjectionToken } from '@angular/core';
import { DalState } from '@campus/dal';
import { SearchFilterInterface, SearchStateInterface } from '@campus/search';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchTermFilterFactory } from '../search-term-filter/search-term-filter.factory';

export const GLOBAL_SEARCH_TERM_FILTER_FACTORY_TOKEN = new InjectionToken(
  'GlobalSearchTermFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchTermFilterFactory extends SearchTermFilterFactory {
  private globalSearchTermFilters = [
    'learningArea',
    'years',
    'eduNets',
    'schoolTypes'
  ];

  constructor(public store: Store<DalState>) {
    super(store);
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    // create 'standard' filters
    const filters = this.globalSearchTermFilters.map(filterName =>
      this.buildFilter(filterName, searchState)
    );

    // conditional filters: learningArea -> methods, learningDomains
    const selectedLearningAreas = searchState.filterCriteriaSelections.get(
      'learningArea'
    ) as number[];

    if (selectedLearningAreas && selectedLearningAreas.length) {
      const methodsByLearningAreaFilters = this.buildFilter(
        'methodsByLearningArea',
        searchState
      );
      filters.push(methodsByLearningAreaFilters);

      const learningDomainsByLearningArea = this.buildFilter(
        'learningDomainsByLearningArea',
        searchState
      );
      filters.push(learningDomainsByLearningArea);
    }

    // nested filters: productTypes
    filters.push(this.getNestedEduContentProductTypes(searchState));

    return combineLatest(filters).pipe(
      map(searchFilters =>
        searchFilters
          .filter(f => f.criteria.values.length > 0)
          .sort((a, b) => this.filterSorter(a, b, this.filterSortOrder))
      )
    );
  }
}
