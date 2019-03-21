import { Injectable, InjectionToken, Type } from '@angular/core';
import {
  DalState,
  EduContentProductTypeInterface,
  EduContentProductTypeQueries,
  EduNetQueries,
  MethodQueries,
  SchoolTypeQueries,
  YearQueries
} from '@campus/dal';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterComponentInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const SEARCH_TERM_FILTER_FACTORY_TOKEN = new InjectionToken(
  'SearchTermFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class SearchTermFilterFactory implements SearchFilterFactory {
  //TODO: Missing learningdomains, will come from store but mocked for now
  public static learningDomains = [
    { id: 1, name: 'Lezen' },
    { id: 2, name: 'Luisteren' },
    { id: 3, name: 'Schrijven' }
  ];

  private keyProperty = 'id';
  private displayProperty = 'name';
  private component = CheckboxListFilterComponent;
  private domHost = 'hostLeft';

  private filterQueries: FilterQueryInterface[] = [
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

    const nestedEduContentProductTypeFilters = this.getNestedEduContentProductTypes(
      searchState
    );

    filters.push(nestedEduContentProductTypeFilters);

    //TODO: Missing learningdomains, will come from store but mocked for now
    filters.push(
      of(SearchTermFilterFactory.learningDomains).pipe(
        map(domains =>
          this.getFilter(
            domains,
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

  /**
   * Reducer function for EduContent product types
   *
   * Normally, the hierarchy for EduContent product types is defined by the parentIds in the database.
   * This function transforms an array of EduContent product types so that they have a children property
   * containing all the EduContent product type children.
   *
   * @param acc Accumulator, should be an array
   * @param cur Current EduContent product type
   * @param idx Index, unused
   * @param src The source array
   */
  productTypesToHierarchy(
    acc: EduContentProductTypeInterface[],
    cur: EduContentProductTypeInterface,
    idx,
    src: EduContentProductTypeInterface[]
  ) {
    if (cur.parent === 0) {
      return [
        {
          children: src.filter(child => child.parent === cur.id),
          ...cur
        },
        ...acc
      ];
    } else return acc;
  }

  /**
   * Transforms the eduContentProductTypes to have FilterCriteriaValues that employ the 'child'
   * attribute for every productType that has a parent. This results in a nested checkboxlist.
   *
   * @param searchState The search state which was passed to getFilters
   */
  getNestedEduContentProductTypes(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface> {
    return this.store.select(EduContentProductTypeQueries.getAll).pipe(
      map(productTypes =>
        productTypes.reduce(this.productTypesToHierarchy, [])
      ),
      map(nestedProductTypes =>
        this.getFilter(
          nestedProductTypes,
          {
            name: 'eduContentProductType',
            label: 'Type',
            component: CheckboxListFilterComponent
          },
          searchState
        )
      )
    );
  }

  private getFilter<T>(
    entities: T[],
    filterQuery: FilterQueryInterface,
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
          visible: true,
          child: (entity as any).children
            ? this.getFilter((entity as any).children, filterQuery, searchState)
                .criteria
            : undefined
        }))
      },
      component: filterQuery.component || this.component,
      domHost: this.domHost
    } as SearchFilterInterface;
  }
}

//Small interface used just here to simplify making filters for the non-special properties
interface FilterQueryInterface {
  query?: MemoizedSelector<object, any[]>;
  name: string;
  label: string;
  component?: Type<SearchFilterComponentInterface>;
}
