import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  public searchState$ = new BehaviorSubject<SearchStateInterface>(null);
  public searchFilters$ = new BehaviorSubject<SearchFilterInterface[]>([]);

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
  }

  public reset(
    mode: SearchModeInterface,
    state: SearchStateInterface = null
  ): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {
    const newValue = { ...this.searchState$.value };
    newValue.from =
      (this.searchState$.value.from || 0) + this.searchMode.results.pageSize;
    this.searchState$.next(newValue);
  }
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {
    const newValue = { ...this.searchState$.value };
    newValue.from = 0;
    newValue.searchTerm = searchTerm;
    this.searchState$.next(newValue);
  }
  public updateResult(result: SearchResultInterface): void {}

  private getMocks(): void {
    this.searchState$ = new BehaviorSubject<SearchStateInterface>(
      this.mockViewmodel.searchState$.value
    );
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }
}
