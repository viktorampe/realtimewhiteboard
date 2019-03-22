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
  // teacher: controller.educontent.area.js
  private globalSearchTermFilters = [
    // 'methodsByLearningArea',
    'years',
    'grades',
    'eduNets',
    'schoolTypes',
    // 'eduContentProductType',
    'learningArea'
    // 'learningDomainsByLearningArea'
  ];
  constructor(public store: Store<DalState>) {
    super(store);
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    let filters = this.globalSearchTermFilters.map(filterName =>
      this.buildFilter(filterName, searchState)
    );

    const selectedLearningAreas = searchState.filterCriteriaSelections.get(
      'learningArea'
    );

    if (selectedLearningAreas.length) {
      const methodsByLearningAreaFilters = selectedLearningAreas.map(
        (learningAreaId: number) =>
          this.buildFilter('methodsByLearningArea', searchState, learningAreaId)
      );
      const learningDomainsByLearningArea = selectedLearningAreas.map(
        (learningAreaId: number) =>
          this.buildFilter(
            'learningDomainsByLearningArea',
            searchState,
            learningAreaId
          )
      );
      filters = [
        ...filters,
        ...methodsByLearningAreaFilters,
        ...learningDomainsByLearningArea
      ];
    }

    filters.push(this.getNestedEduContentProductTypes(searchState));

    return combineLatest(filters);
  }
}
