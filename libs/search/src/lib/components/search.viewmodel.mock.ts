import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { Subject } from 'rxjs';
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
import { CheckboxLineFilterComponent } from './checkbox-line-filter/checkbox-line-filter-component';
import { SearchViewModel } from './search.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockSearchViewModel
  implements ViewModelInterface<SearchViewModel> {
  public searchState$ = new Subject<SearchStateInterface>();
  public searchFilters$ = new Subject<SearchFilterInterface>();

  constructor() {
    this.searchState$.next(this.getMockSearchState());
    this.searchFilters$.next(this.getMockSearchFilter());
  }

  public reset(state: SearchStateInterface, mode: SearchModeInterface): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {}
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface<any>): void {} //TODO: remove <any> when other scaffold branch is merged

  private getMockSearchState(): SearchStateInterface {
    const mockSeachState = {
      searchTerm: 'nemo',
      filterCriteriaSelections: new Map<string, string[]>()
    };

    return mockSeachState;
  }

  private getMockSearchFilter(): SearchFilterInterface {
    const mockSearchFilter = {
      criteria: new SearchFilterCriteriaFixture({}, [
        new SearchFilterCriteriaValuesFixture()
      ]),
      component: new CheckboxLineFilterComponent(),
      domHost: 'host'
    };

    return mockSearchFilter;
  }
}
