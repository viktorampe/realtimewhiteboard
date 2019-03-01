import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  private searchMode: SearchModeInterface;

  public searchState$: BehaviorSubject<SearchStateInterface>;
  public searchFilters$ = new Subject<SearchFilterInterface[]>();

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
  }

  public reset(state: SearchStateInterface, mode: SearchModeInterface): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {
    this.searchState$.value.from =
      (this.searchState$.value.from || 0) + this.searchMode.results.pageSize;
    this.searchState$.next({ ...this.searchState$.value });
  }
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface): void {}

  private getMocks(): void {
    this.searchState$ = new BehaviorSubject<SearchStateInterface>(
      this.mockViewmodel.searchState$.value
    );
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }
}
