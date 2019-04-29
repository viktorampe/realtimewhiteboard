import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent
} from '../components';
import {
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '../interfaces';
import { SearchFilterCriteriaValuesFixture } from './search-filter-criteria.fixture';

@Injectable()
export class FilterFactoryFixture implements SearchFilterFactory {
  // polpo reference: teacher: controller.educontent.area.js

  private componentCriteriaMap = {
    methods: CheckboxListFilterComponent,
    years: CheckboxLineFilterComponent,
    grades: CheckboxLineFilterComponent,
    eduNets: CheckboxListFilterComponent,
    schoolTypes: CheckboxListFilterComponent,
    eduContentProductType: CheckboxListFilterComponent,
    learningArea: CheckboxListFilterComponent
  };

  private domHostCriteriaMap = {
    methods: 'hostLeft',
    years: 'hostLeft',
    grades: 'hostLeft',
    eduNets: 'hostLeft',
    schoolTypes: 'hostLeft',
    eduContentProductType: 'hostLeft',
    learningArea: 'hostLeft'
  };
  private searchCriteria = {
    // learningDomains: {
    //   name: 'learningDomains',
    //   label: 'Leerdomein',
    //   keyProperty: 'id',
    //   displayProperty: 'name',
    //   values: null
    // },
    methods: {
      name: 'methods',
      label: 'Methode',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
    },
    years: {
      name: 'years',
      label: 'Jaar',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
    },
    grades: {
      name: 'grades',
      label: 'Graad',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
    },
    eduNets: {
      name: 'eduNets',
      label: 'Onderwijsnet',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
    },
    schoolTypes: {
      name: 'schoolTypes',
      label: 'Onderwijsvorm',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
    },
    eduContentProductType: {
      name: 'eduContentProductType',
      label: 'Type',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
    },
    learningArea: {
      name: 'learningArea',
      label: 'Leergebied',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [new SearchFilterCriteriaValuesFixture()]
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

  getPredictionFilterNames(): string[] {
    return Object.values(this.searchCriteria).map(value => value.name);
  }
}
