import { Injectable } from '@angular/core';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable, of } from 'rxjs';

@Injectable()
export class StandardSearchService implements SearchFilterFactory {
  // teacher: controller.educontent.area.js
  // reference for options
  // 0 Leerdomein
  // 1 Methode
  // 2 Jaar
  // 3 Graad
  // 4 Onderwijsnet
  // 5 Onderwijsvorm
  // 6 Type
  private componentCriteriaMap = {
    methods: CheckboxListFilterComponent,
    years: CheckboxLineFilterComponent,
    grades: CheckboxLineFilterComponent,
    eduNets: CheckboxListFilterComponent,
    schoolTypes: CheckboxListFilterComponent,
    eduContentProductType: CheckboxListFilterComponent,
    learningArea: CheckboxListFilterComponent
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
      values: null
    },
    years: {
      name: 'years',
      label: 'Jaar',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    },
    grades: {
      name: 'grades',
      label: 'Graad',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    },
    eduNets: {
      name: 'eduNets',
      label: 'Onderwijsnet',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    },
    schoolTypes: {
      name: 'schoolTypes',
      label: 'Onderwijsvorm',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    },
    eduContentProductType: {
      name: 'eduContentProductType',
      label: 'Type',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    },
    learningArea: {
      name: 'learningArea',
      label: 'Leergebied',
      keyProperty: 'id',
      displayProperty: 'name',
      values: null
    }
  };

  private searchFilters: SearchFilterInterface[] = Object.keys(
    this.searchCriteria
  ).map(criteriaName => {
    const searchFilter: SearchFilterInterface = {
      criteria: this.searchCriteria[criteriaName],
      component: this.componentCriteriaMap[criteriaName],
      domHost: 'hostLeft'
    };
    return searchFilter;
  });

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of(this.searchFilters);
  }
}
