import { Injectable, InjectionToken } from '@angular/core';
import {
  DalState,
  LearningAreaInterface,
  LearningAreaQueries
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

  private learningAreas$: Observable<Dictionary<LearningAreaInterface>>;

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

  constructor(private store: Store<DalState>) {
    this.learningAreas$ = this.store
      .select(LearningAreaQueries.getAllEntities)
      .pipe(take(1));
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    if (searchState.filterCriteriaSelections.has('learningArea')) {
      this.searchCriteria['learningArea'].values = this.getCriteriaValues(
        searchState.filterCriteriaSelections.get('learningArea')
      );
    }
    return of(this.searchFilters);
  }

  getSearchFilter(criteriaName: string) {
    const searchFilter: SearchFilterInterface = {
      criteria: this.searchCriteria[criteriaName],
      component: this.componentCriteriaMap[criteriaName],
      domHost: this.domHostCriteriaMap[criteriaName]
    };
    return searchFilter;
  }

  getCriteriaValues(
    selectedValues: (string | number)[]
  ): SearchFilterCriteriaValuesInterface[] {
    let learningAreasFromStore: Dictionary<LearningAreaInterface>;

    this.learningAreas$.subscribe(
      (learningAreas: Dictionary<LearningAreaInterface>) => {
        learningAreasFromStore = learningAreas;
      }
    );

    return (this.searchCriteria['learningArea'].values = Object.values(
      learningAreasFromStore
    ).map(cur => {
      const criteriaValue: SearchFilterCriteriaValuesInterface = {
        data: cur,
        selected: !!selectedValues.find(selectedId => selectedId === cur.id)
      };
      return criteriaValue;
    }));
  }
}
