import { Injectable, InjectionToken } from '@angular/core';
import {
  DalState,
  EduContentProductTypeQueries,
  EduNetQueries,
  LearningAreaQueries,
  MethodInterface,
  MethodQueries,
  SchoolTypeQueries
} from '@campus/dal';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

export const GLOBAL_SEARCH_TERM_FILTER_FACTORY_TOKEN = new InjectionToken(
  'GlobalSearchTermFilterFactory'
);

@Injectable()
export class GlobalSearchTermFilterFactory implements SearchFilterFactory {
  // teacher: controller.educontent.area.js

  private componentCriteriaMap = {
    methods: CheckboxListFilterComponent,
    years: CheckboxLineFilterComponent,
    grades: CheckboxLineFilterComponent,
    eduNets: CheckboxListFilterComponent,
    schoolTypes: CheckboxListFilterComponent,
    eduContentProductType: CheckboxListFilterComponent,
    learningArea: CheckboxListFilterComponent,
    learningDomains: CheckboxListFilterComponent
  };

  private domHostCriteriaMap = {
    methods: 'hostLeft',
    years: 'hostLeft',
    grades: 'hostLeft',
    eduNets: 'hostLeft',
    schoolTypes: 'hostLeft',
    eduContentProductType: 'hostLeft',
    learningArea: 'hostLeft',
    learningDomains: 'hostLeft'
  };

  private searchCriteria: {
    [name: string]: SearchFilterCriteriaInterface;
  } = {
    learningDomains: {
      name: 'learningDomains',
      label: 'Leerdomein',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    methods: {
      name: 'methods',
      label: 'Methode',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    years: {
      name: 'years',
      label: 'Jaar',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    grades: {
      name: 'grades',
      label: 'Graad',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    eduNets: {
      name: 'eduNets',
      label: 'Onderwijsnet',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    schoolTypes: {
      name: 'schoolTypes',
      label: 'Onderwijsvorm',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    eduContentProductType: {
      name: 'eduContentProductType',
      label: 'Type',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    },
    learningArea: {
      name: 'learningArea',
      label: 'Leergebied',
      keyProperty: 'id',
      displayProperty: 'name',
      values: []
    }
  };

  private searchFilters: SearchFilterInterface[] = Object.keys(
    this.searchCriteria
  ).map(criteriaName => {
    const searchFilter: SearchFilterInterface = {
      criteria: this.searchCriteria[criteriaName],
      component: this.componentCriteriaMap[criteriaName],
      domHost: this.domHostCriteriaMap[criteriaName]
    };
    return searchFilter;
  });

  constructor(private store: Store<DalState>) {}

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    if (searchState.filterCriteriaSelections.has('learningArea')) {
      this.searchCriteria['learningArea'].values = this.getCriteriaValues(
        'learningArea',
        searchState.filterCriteriaSelections.get('learningArea'),
        this.store.select(LearningAreaQueries.getAllEntities).pipe(take(1))
      );

      // only when learning area is selected
      this.searchCriteria['methods'].values = this.getCriteriaValues<
        MethodInterface
      >(
        'methods',
        searchState.filterCriteriaSelections.get('methods'),
        this.store.select(MethodQueries.getAllEntities)
      );
    }

    if (searchState.filterCriteriaSelections.has('eduNets')) {
      this.searchCriteria['eduNets'].values = this.getCriteriaValues(
        'eduNets',
        searchState.filterCriteriaSelections.get('eduNets'),
        this.store.select(EduNetQueries.getAllEntities).pipe(take(1))
      );
    }

    if (searchState.filterCriteriaSelections.has('schoolTypes')) {
      this.searchCriteria['schoolTypes'].values = this.getCriteriaValues(
        'schoolTypes',
        searchState.filterCriteriaSelections.get('schoolTypes'),
        this.store.select(SchoolTypeQueries.getAllEntities).pipe(take(1))
      );
    }

    // if (searchState.filterCriteriaSelections.has('learningDomains')) {
    //   this.searchCriteria['learningDomains'].values = this.getCriteriaValues(
    //     'learningDomains',
    //     searchState.filterCriteriaSelections.get('learningDomains'),
    //     this.store.select(LearningDomainQueries.getAllEntities).pipe(take(1))
    //   );
    // }

    if (searchState.filterCriteriaSelections.has('eduContentProductType')) {
      this.searchCriteria[
        'eduContentProductType'
      ].values = this.getCriteriaValues(
        'eduContentProductType',
        searchState.filterCriteriaSelections.get('eduContentProductType'),
        this.store
          .select(EduContentProductTypeQueries.getAllEntities)
          .pipe(take(1))
      );
    }

    return of(this.searchFilters);
  }

  getCriteriaValues<T>(
    filterKey: string,
    selectedValues: (string | number)[],
    source$: Observable<Dictionary<T>>
  ): SearchFilterCriteriaValuesInterface[] {
    let valuesFromStore: Dictionary<T>;

    source$.subscribe((entities: Dictionary<T>) => {
      valuesFromStore = entities;
    });

    return (this.searchCriteria[filterKey].values = Object.values(
      valuesFromStore
    ).map(value => {
      const criteriaValue: SearchFilterCriteriaValuesInterface = {
        data: value,
        selected: !!selectedValues.find(selectedId => selectedId === value.id)
      };
      return criteriaValue;
    }));
  }
}
