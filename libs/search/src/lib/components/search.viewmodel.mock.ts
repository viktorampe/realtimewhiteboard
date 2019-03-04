import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import {
  SearchFilterCriteriaInterface,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from './../+fixtures/search-filter-criteria.fixture';
import { BreadcrumbFilterComponent } from './breadcrumb-filter/breadcrumb-filter.component';
import { CheckboxLineFilterComponent } from './checkbox-line-filter/checkbox-line-filter-component';
import { CheckboxListFilterComponent } from './checkbox-list-filter/checkbox-list-filter.component';
import { ColumnFilterComponent } from './column-filter/column-filter.component';
import { SearchViewModel } from './search.viewmodel';
import { SelectFilterComponent } from './select-filter-component/select-filter.component';

@Injectable({
  providedIn: 'root'
})
export class MockSearchViewModel
  implements ViewModelInterface<SearchViewModel> {
  public searchState$ = new BehaviorSubject<SearchStateInterface>(undefined);
  public searchFilters$ = new BehaviorSubject<SearchFilterInterface[]>([]);

  constructor() {
    // this.searchState$.next(this.getMockSearchState());
    // this.searchFilters$.next(this.getMockSearchFilter());
  }

  public reset(
    mode: SearchModeInterface,
    state: SearchStateInterface = null
  ): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {}
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface): void {}

  private getMockSearchState(): SearchStateInterface {
    const mockSearchState = {
      searchTerm: 'nemo',
      filterCriteriaSelections: new Map<string, string[]>()
    };

    return mockSearchState;
  }

  private getMockSearchFilter(): SearchFilterInterface[] {
    const mockSearchFilter = [
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new CheckboxLineFilterComponent(),
        domHost: 'host-left'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new CheckboxListFilterComponent(),
        domHost: 'host-left'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new BreadcrumbFilterComponent(),
        domHost: 'host-top'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new ColumnFilterComponent(),
        domHost: 'host-left'
      },
      {
        criteria: new SearchFilterCriteriaFixture({}, [
          new SearchFilterCriteriaValuesFixture(),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 2, name: 'foo' }
          }),
          new SearchFilterCriteriaValuesFixture({
            data: { id: 3, name: 'foo bar' }
          })
        ]),
        component: new SelectFilterComponent(),
        domHost: 'host-top'
      }
    ];

    return mockSearchFilter;
  }
}
