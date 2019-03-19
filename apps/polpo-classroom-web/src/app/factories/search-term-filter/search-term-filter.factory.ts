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
import { combineLatest, Observable, of } from 'rxjs';
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
    { query: MethodQueries.getAll, name: 'methods', label: 'Methode' }
  ];

  //TODO: Missing learningdomains, will come from store but mocked for now
  public static learningDomains = [
    { id: 1, name: 'Lezen' },
    { id: 2, name: 'Luisteren' },
    { id: 3, name: 'Schrijven' }
  ];

  constructor(private store: Store<DalState>) {}

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const filters = this.filterQueries.map(filterQuery => {
      return this.store
        .select(filterQuery.query)
        .pipe(
          map(entities => this.getFilter(entities, filterQuery, searchState))
        );
    });

    const nestedEduContentProductTypeFilters = this.store
      .select(EduContentProductTypeQueries.getAll)
      .pipe(
        map(entities =>
          entities
            .map((val, ind, arr) => {
              return {
                children: arr.filter(child => child.parent == val.id),
                ...val
              };
            })
            .filter(val => val.parent == 0)
        ),
        map(entities =>
          this.getFilter(
            entities,
            { name: 'eduContentProductType', label: 'Type' },
            searchState
          )
        )
      );

    filters.push(nestedEduContentProductTypeFilters);

    //TODO: Missing learningdomains, will come from store but mocked for now
    filters.push(
      of(SearchTermFilterFactory.learningDomains).pipe(
        map(entities =>
          this.getFilter(
            entities,
            {
              name: 'learningDomains',
              label: 'Leergebied'
            },
            searchState
          )
        )
      )
    );

    return combineLatest(filters);
  }

  private getFilter(
    entities: any,
    filterQuery: any,
    searchState: SearchStateInterface
  ): SearchFilterInterface {
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
          ),
          child: (entity as any).children
            ? this.getFilter((entity as any).children, filterQuery, searchState)
                .criteria
            : undefined
        }))
      },
      component: filterQuery.component || this.component,
      domHost: this.domHost,
      options: undefined
    } as SearchFilterInterface;
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
