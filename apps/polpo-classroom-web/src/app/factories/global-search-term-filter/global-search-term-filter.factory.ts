import { Injectable, InjectionToken } from '@angular/core';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterCriteriaValuesFixture,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable, of } from 'rxjs';

export const STANDARD_SEARCH_SERVICE_TOKEN = new InjectionToken(
  'StandardSearchService'
);

@Injectable()
export class StandardSearchService implements SearchFilterFactory {
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
  private searchCriteria = {
    learningDomains: {
      name: 'learningDomains',
      label: 'Leerdomein',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    },
    methods: {
      name: 'methods',
      label: 'Methode',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
    },
    years: {
      name: 'years',
      label: 'Jaar',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
    },
    grades: {
      name: 'grades',
      label: 'Graad',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
    },
    eduNets: {
      name: 'eduNets',
      label: 'Onderwijsnet',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
    },
    schoolTypes: {
      name: 'schoolTypes',
      label: 'Onderwijsvorm',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
    },
    eduContentProductType: {
      name: 'eduContentProductType',
      label: 'Type',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
    },
    learningArea: {
      name: 'learningArea',
      label: 'Leergebied',
      keyProperty: 'id',
      displayProperty: 'name',
      values: new SearchFilterCriteriaValuesFixture()
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

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of(this.searchFilters);
  }
}
