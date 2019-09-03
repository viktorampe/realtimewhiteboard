import { Injectable, InjectionToken } from '@angular/core';
import {
  DalState,
  DiaboloPhaseQueries,
  EduContentProductTypeQueries,
  LearningDomainQueries,
  MethodQueries,
  YearQueries
} from '@campus/dal';
import {
  ButtonToggleFilterComponent,
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import {
  MemoizedSelector,
  MemoizedSelectorWithProps,
  select,
  Store
} from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterQueryInterface } from '../filter-query.interface';

export const GLOBAL_FILTER_FACTORY_TOKEN = new InjectionToken(
  'GlobalFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class GlobalFilterFactory implements SearchFilterFactory {
  public readonly maxVisibleItems = 5;

  private keyProperty = 'id';
  private displayProperty = 'name';
  private component = CheckboxListFilterComponent;
  private domHost = 'hostLeft';

  protected filterSortOrder = [
    'methods',
    'learningDomains',
    'diaboloPhase',
    'eduContentProductType',
    'years'
  ];

  protected filterQueries: {
    [key: string]: FilterQueryInterface;
  } = {
    eduContentProductType: {
      query: EduContentProductTypeQueries.getAllOrderedByName,
      name: 'eduContentProductType',
      label: 'Type',
      options: { maxVisibleItems: this.maxVisibleItems }
    },
    diaboloPhase: {
      query: DiaboloPhaseQueries.getAll,
      name: 'diaboloPhase',
      label: 'Diabolo',
      component: ButtonToggleFilterComponent,
      displayProperty: 'icon',
      options: { multiple: true }
    },
    methods: {
      query: MethodQueries.getAllowedMethods,
      name: 'methods',
      label: 'Methode',
      options: { maxVisibleItems: this.maxVisibleItems }
    },
    learningDomains: {
      query: LearningDomainQueries.getAll,
      name: 'learningDomains',
      label: 'Leerdomein',
      options: { maxVisibleItems: this.maxVisibleItems }
    },
    years: {
      query: YearQueries.getAll,
      name: 'years',
      label: 'Jaar',
      component: CheckboxLineFilterComponent
    }
  };

  constructor(public store: Store<DalState>) {}

  public getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return combineLatest(this.createFilters(searchState)).pipe(
      map(searchFilters =>
        searchFilters
          .filter(f => {
            return f.criteria.values.length > 0;
          })
          .sort((a, b) => this.filterSorter(a, b, this.filterSortOrder))
      )
    );
  }

  public getPredictionFilterNames(): string[] {
    return Object.values(this.filterQueries).map(value => value.name);
  }

  protected createFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface>[] {
    const filters = Object.values(this.filterQueries).map(fQ =>
      this.buildFilter(fQ.name, searchState)
    );

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
          visible: true,
          child: (entity as any).children
            ? this.getFilter((entity as any).children, filterQuery, searchState)
                .criteria
            : undefined
        }))
      },
      component: filterQuery.component || this.component,
      domHost: filterQuery.domHost || this.domHost
    } as SearchFilterInterface;
    if (filterQuery.options) searchFilter.options = filterQuery.options;
    return searchFilter;
  }

  private filterSorter(
    a: SearchFilterInterface,
    b: SearchFilterInterface,
    order: string[]
  ): number {
    let aIndex = order.indexOf(
      (a.criteria as SearchFilterCriteriaInterface).name
    );
    aIndex = aIndex === -1 ? order.length : aIndex; // not found -> add at end

    let bIndex = order.indexOf(
      (b.criteria as SearchFilterCriteriaInterface).name
    );
    bIndex = bIndex === -1 ? order.length : bIndex; // not found -> add at end

    return aIndex - bIndex;
  }

  protected buildFilter(
    name: string,
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface> {
    const filterQuery = this.filterQueries[name];
    if (filterQuery.learningAreaDependent) {
      return this.store.pipe(
        select(filterQuery.query as MemoizedSelectorWithProps<
          Object,
          any,
          any[]
        >),
        map(entities => this.getFilter(entities, filterQuery, searchState))
      );
    } else {
      return this.store.pipe(
        select(filterQuery.query as MemoizedSelector<Object, any[]>),
        map(entities => {
          return this.getFilter(entities, filterQuery, searchState);
        })
      );
    }
  }
}
