import { Injectable, InjectionToken, Type } from '@angular/core';
import {
  DalState,
  EduContentProductTypeInterface,
  EduContentProductTypeQueries,
  EduNetQueries,
  LearningAreaQueries,
  LearningDomainQueries,
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
import {
  MemoizedSelector,
  MemoizedSelectorWithProps,
  Store
} from '@ngrx/store';
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

  public filterQueries: {
    [key: string]: FilterQueryInterface;
  } = {
    learningArea: {
      query: LearningAreaQueries.getAll,
      name: 'learningArea',
      label: 'Leergebied',
      component: CheckboxListFilterComponent
    },
    years: {
      query: YearQueries.getAll,
      name: 'years',
      label: 'Jaar',
      component: CheckboxLineFilterComponent
    },
    eduNets: {
      query: EduNetQueries.getAll,
      name: 'eduNets',
      label: 'Onderwijsnet'
    },
    schoolTypes: {
      query: SchoolTypeQueries.getAll,
      name: 'schoolTypes',
      label: 'Onderwijsvorm'
    },
    methodsByLearningArea: {
      query: MethodQueries.getByLearningAreaIds,
      name: 'methods',
      label: 'Methode',
      learningAreaDependent: true
    },
    learningDomainsByLearningArea: {
      query: LearningDomainQueries.getByLearningAreas,
      label: 'Leergebied',
      name: 'learningDomains',
      learningAreaDependent: true
    },
    grades: {
      query: LearningDomainQueries.getByLearningArea,
      label: 'Graad',
      name: 'grades'
    }
  };

  constructor(public store: Store<DalState>) {}

  public buildFilter(
    name: string,
    searchState: SearchStateInterface,
    learningAreaOverride: number[] = null
  ): Observable<SearchFilterInterface> {
    const filterQuery = this.filterQueries[name];
    if (filterQuery.learningAreaDependent) {
      return this.store
        .select(
          filterQuery.query as MemoizedSelectorWithProps<Object, any, any[]>,
          {
            learningAreaIds: learningAreaOverride || [
              searchState.filterCriteriaSelections.get('learningArea')[0]
            ]
          }
        )
        .pipe(
          map(entities => this.getFilter(entities, filterQuery, searchState))
        );
    } else {
      return this.store
        .select(filterQuery.query as MemoizedSelector<Object, any[]>)
        .pipe(
          map(entities => this.getFilter(entities, filterQuery, searchState))
        );
    }
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    const filters = [
      'years',
      'eduNets',
      'schoolTypes',
      'methodsByLearningArea'
    ].map(filterName => {
      return this.buildFilter(filterName, searchState);
    });

    filters.push(this.getNestedEduContentProductTypes(searchState));
    filters.push(
      this.buildFilter('learningDomainsByLearningArea', searchState)
    );

    return combineLatest(filters).pipe(
      map(searchFilters =>
        searchFilters.filter(f => f.criteria.values.length > 0)
      )
    );
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
        ...acc,
        {
          children: src.filter(child => child.parent === cur.id),
          ...cur
        }
      ];
    } else return acc;
  }

  /**
   * Transforms the eduContentProductTypes to have FilterCriteriaValues that employ the 'child'
   * attribute for every productType that has a parent. This results in a nested checkboxlist.
   *
   * @param searchState The search state which was passed to getFilters
   */
  public getNestedEduContentProductTypes(
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

  public getFilter<T>(
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
      domHost: this.domHost
    } as SearchFilterInterface;
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
  learningAreaDependent?: boolean;
}
