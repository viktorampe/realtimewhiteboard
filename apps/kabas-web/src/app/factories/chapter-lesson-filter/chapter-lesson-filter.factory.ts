import { Injectable, InjectionToken, Type } from '@angular/core';
import { DalState, EduContentProductTypeQueries } from '@campus/dal';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface,
  SelectFilterComponent
} from '@campus/search';
import {
  MemoizedSelector,
  MemoizedSelectorWithProps,
  select,
  Store
} from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const CHAPTER_LESSON_FILTER_FACTORY_TOKEN = new InjectionToken(
  'ChapterLessonFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class ChapterLessonFilterFactory implements SearchFilterFactory {
  private keyProperty = 'id';
  private displayProperty = 'name';
  private component = SelectFilterComponent;
  private domHost = 'hostTop';

  private filterSortOrder = ['eduContentProductType', 'diaboloPhase'];

  protected filterQueries: {
    [key: string]: FilterQueryInterface;
  } = {
    eduContentProductType: {
      query: EduContentProductTypeQueries.getAll,
      name: 'eduContentProductType',
      label: 'Type',
      component: SelectFilterComponent
    }
  };

  constructor(public store: Store<DalState>) {}

  getFilters(
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
    const filters: Observable<SearchFilterInterface>[] = [];
    const eduContentProductTypeFilter$ = this.buildFilter(
      'eduContentProductType',
      searchState
    );
    filters.push(eduContentProductTypeFilter$);

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

//Small interface used just here to simplify making filters for the non-special properties
export interface FilterQueryInterface {
  query?:
    | MemoizedSelector<object, any[]>
    | MemoizedSelectorWithProps<object, any, any[]>;
  name: string;
  label: string;
  component?: Type<SearchFilterComponentInterface>;
  displayProperty?: string;
  learningAreaDependent?: boolean;
  domHost?: string;
  options?: any;
}
