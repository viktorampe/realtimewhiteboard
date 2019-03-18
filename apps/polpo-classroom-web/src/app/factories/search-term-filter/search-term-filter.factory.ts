import { Injectable, InjectionToken } from '@angular/core';
import {
  DalState,
  EduContentProductTypeQueries,
  EduNetQueries,
  MethodQueries,
  SchoolTypeQueries,
  YearQueries
} from '@campus/dal';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export const SEARCH_TERM_FILTER_FACTORY_TOKEN = new InjectionToken(
  'SearchTermFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class SearchTermFilterFactory implements SearchFilterFactory {
  private keyProperty = 'id';
  private displayProperty = 'name';
  private component = CheckboxListFilterComponent;
  private domHost = 'hostLeft';
  private filterQueries = [
    {
      query: YearQueries.getAll,
      name: 'years',
      label: 'Jaar',
      component: CheckboxLineFilterComponent
    },
    { query: EduNetQueries.getAll, name: 'eduNets', label: 'Onderwijsnet' },
    {
      query: SchoolTypeQueries.getAll,
      name: 'schoolTypes',
      label: 'Onderwijsvorm'
    },
    { query: MethodQueries.getAll, name: 'methods', label: 'Methode' },
    {
      query: EduContentProductTypeQueries.getAll,
      name: 'eduContentProductType',
      label: 'Type'
    }
  ];

  //TODO: Missing learningdomains

  constructor(private store: Store<DalState>) {}

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const filters = this.filterQueries.map(filterQuery => {
      return this.store.select(filterQuery.query).pipe(
        map(entities => {
          return {
            criteria: {
              name: filterQuery.name,
              label: filterQuery.label,
              keyProperty: this.keyProperty,
              displayProperty: this.displayProperty,
              values: Object.values(entities).map(entity => ({
                data: entity,
                selected: this.isSelectedInSearchState(
                  entity,
                  filterQuery.name,
                  this.keyProperty,
                  searchState
                )
              }))
            },
            component: filterQuery.component || this.component,
            domHost: this.domHost
          } as SearchFilterInterface;
        })
      );
    });

    return combineLatest(filters);
  }

  private isSelectedInSearchState(
    object: any,
    name: string,
    keyProperty: string,
    searchState: SearchStateInterface
  ): boolean {
    const key = searchState.filterCriteriaSelections.get(name);
    return key
      ? key.includes((object[keyProperty] as unknown) as string | number)
      : false;
  }
}
