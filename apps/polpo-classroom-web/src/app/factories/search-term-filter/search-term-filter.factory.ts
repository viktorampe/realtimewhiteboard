import { Injectable, InjectionToken } from '@angular/core';
import { DalState } from '@campus/dal';
import {
  CheckboxLineFilterComponent,
  CheckboxListFilterComponent,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchStateInterface
} from '@campus/search';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
export const SEARCH_TERM_FILTER_FACTORY_TOKEN = new InjectionToken(
  'SearchTermFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class SearchTermFilterFactory implements SearchFilterFactory {
  private componentCriteriaMap = {
    years: CheckboxLineFilterComponent,
    eduNets: CheckboxListFilterComponent,
    schoolTypes: CheckboxListFilterComponent,
    methods: CheckboxListFilterComponent,
    learningArea: CheckboxListFilterComponent,
    eduContentProductType: CheckboxListFilterComponent
  };

  private domHostCriteriaMap = {
    years: 'hostLeft',
    eduNets: 'hostLeft',
    schoolTypes: 'hostLeft',
    methods: 'hostLeft',
    learningArea: 'hostLeft',
    eduContentProductType: 'hostLeft'
  };

  private searchCriteria = {
    years: {
      name: 'years',
      label: 'Jaar',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: ['a', 'b', 'c'],
          visible: true
        }
      ]
    },
    eduNets: {
      name: 'eduNets',
      label: 'Onderwijsnet',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: ['a', 'b', 'c'],
          visible: true
        }
      ]
    },
    schoolTypes: {
      name: 'schoolTypes',
      label: 'Onderwijsvorm',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: ['a', 'b', 'c'],
          visible: true
        }
      ]
    },
    methods: {
      name: 'methods',
      label: 'Methode',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: ['a', 'b', 'c'],
          visible: true
        }
      ]
    },
    learningArea: {
      name: 'learningArea',
      label: 'Leergebied',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: ['a', 'b', 'c'],
          visible: true
        }
      ]
    },
    eduContentProductType: {
      name: 'eduContentProductType',
      label: 'Type',
      keyProperty: 'id',
      displayProperty: 'name',
      values: [
        {
          data: ['a', 'b', 'c'],
          visible: true
        }
      ]
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
    //this.store.select(EduNetQueries.)
  }

  getFilters(
    searchState: SearchStateInterface
  ): Observable<SearchFilterInterface[]> {
    return of(this.searchFilters);
  }
}
