import { Injectable, InjectionToken } from '@angular/core';
import { DalState, MethodLevelQueries } from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { MemoizedSelectorWithProps, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterQueryInterface } from '../filter-query.interface';

export const UNLOCKED_EXERCISE_FILTER_FACTORY_TOKEN = new InjectionToken(
  'UnlockedExerciseFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class UnlockedExerciseFilterFactory implements SearchFilterFactory {
  private keyProperty = 'id';
  private displayProperty = 'label';
  private component = ButtonToggleFilterComponent;
  private domHost = 'hostTop';

  protected filterSortOrder = ['methodLevel'];

  protected filterQueries: {
    [key: string]: FilterQueryInterface;
  } = {
    methodLevel: {
      // TODO: getAllForMethodId -> need to create this one -> dict
      query: MethodLevelQueries.getAll,
      name: 'methodLevel',
      label: 'Type',
      methodDependent: true
    }
  };

  constructor(public store: Store<DalState>) {}

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return combineLatest(this.createFilters(searchState)).pipe(
      map(searchFilters =>
        searchFilters.filter(f => {
          return f.criteria.values.length > 0;
        })
      )
    );
  }

  public getPredictionFilterNames(): string[] {
    return Object.values(this.filterQueries).map(value => value.name);
  }

  protected createFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface>[] {
    const filters: Observable<SearchFilterInterface>[] = [];
    const methodLevelFilter = this.buildFilter('methodLevel', searchState);
    filters.push(methodLevelFilter);

    return filters;
  }

  private getFilter<T>(
    entities: T[],
    filterQuery: FilterQueryInterface,
    searchState: SearchStateInterface
  ): SearchFilterInterface {
    const searchFilter = {
      criteria: {
        name: filterQuery.name,
        label: filterQuery.label,
        keyProperty: this.keyProperty,
        displayProperty: filterQuery.displayProperty || this.displayProperty,
        values: entities.map(entity => ({
          data: entity,
          visible: true
        }))
      },
      component: filterQuery.component || this.component,
      domHost: filterQuery.domHost || this.domHost
    } as SearchFilterInterface;
    if (filterQuery.options) searchFilter.options = filterQuery.options;
    return searchFilter;
  }

  protected buildFilter(
    name: string,
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface> {
    const filterQuery = this.filterQueries[name];
    return this.store.pipe(
      select(filterQuery.query as MemoizedSelectorWithProps<Object, any, any>, {
        methodIds: searchState.filterCriteriaSelections.get('method')
      }),
      // TODO -> waiting for selector
      // map((dict: { [id: string]: MethodLevelInterface }) =>
      //   this.getFilter(Object.values(dict), filterQuery, searchState)
      // )
      map(entities => this.getFilter(entities, filterQuery, searchState))
    );
  }
}
