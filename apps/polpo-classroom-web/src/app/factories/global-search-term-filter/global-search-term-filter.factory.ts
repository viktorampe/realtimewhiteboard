import { Injectable, InjectionToken } from '@angular/core';
import { DalState } from '@campus/dal';
import { SearchFilterInterface, SearchStateInterface } from '@campus/search';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { SearchTermFilterFactory } from '../search-term-filter/search-term-filter.factory';

export const GLOBAL_SEARCH_TERM_FILTER_FACTORY_TOKEN = new InjectionToken(
  'GlobalSearchTermFilterFactory'
);

@Injectable()
export class GlobalSearchTermFilterFactory extends SearchTermFilterFactory {
  private globalSearchTermFilters = [
    'years',
    'eduNets',
    'schoolTypes',
    'learningArea'
  ];
  constructor(public store: Store<DalState>) {
    super(store);
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const filters = this.globalSearchTermFilters.map(filterName =>
      this.buildFilter(filterName, searchState)
    );

    const selectedLearningAreas = searchState.filterCriteriaSelections.get(
      'learningArea'
    ) as number[];

    if (selectedLearningAreas.length) {
      const methodsByLearningAreaFilters = this.buildFilter(
        'methodsByLearningArea',
        searchState,
        selectedLearningAreas
      );
      filters.push(methodsByLearningAreaFilters);

      const learningDomainsByLearningArea = this.buildFilter(
        'learningDomainsByLearningArea',
        searchState,
        selectedLearningAreas
      );
      filters.push(learningDomainsByLearningArea);
    }

    filters.push(this.getNestedEduContentProductTypes(searchState));

    return combineLatest(filters);
  }
}
