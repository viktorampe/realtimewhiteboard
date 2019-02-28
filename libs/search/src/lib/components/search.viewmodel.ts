import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SearchFilterInterface,
  SearchResultInterface,
  SearchStateInterface
} from '../interfaces';
import { SearchFilterCriteriaInterface } from './../interfaces/search-filter-criteria.interface';
import {
  SearchModeInterface,
  SortModeInterface
} from './../interfaces/search-mode-interface';
import { MockSearchViewModel } from './search.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class SearchViewModel {
  public searchState$: Observable<SearchStateInterface>;
  public searchFilters$: Observable<SearchFilterInterface>;

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
  }

  public reset(state: SearchStateInterface, mode: SearchModeInterface): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {}
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface<any>): void {} //TODO: remove <any> when other scaffold branch is merged

  private getMocks(): void {
    this.searchState$ = this.mockViewmodel.searchState$;
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }
}
