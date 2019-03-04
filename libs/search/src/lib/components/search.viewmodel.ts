import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  SearchFilterFactory,
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
  private filterFactory: SearchFilterFactory;

  // source stream
  private filters$ = new BehaviorSubject<SearchFilterInterface[]>([]);

  public searchState$ = new BehaviorSubject<SearchStateInterface>(null);
  public searchFilters$ = new BehaviorSubject<SearchFilterInterface[]>([]);

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
  }

  public reset(
    mode: SearchModeInterface,
    state: SearchStateInterface = null
  ): void {
    let newSearchState: SearchStateInterface;
    this.searchMode = mode;
    this.filterFactory = new this.searchMode.searchFilterFactory(); // used by updateFilters()

    if (state) {
      // we want to update the state
      newSearchState = { ...state };
    } else {
      // we want to reset the state
      // note: sort mode should stay the same on reset
      newSearchState = { ...this.searchState$.value };
      newSearchState.searchTerm = '';
      newSearchState.filterCriteriaSelections.clear();
      newSearchState.from = 0;
    }

    // trigger new search
    this.searchState$.next(newSearchState);

    // request new filters
    this.updateFilters();
  }

  public changeSort(sortMode: SortModeInterface): void {
    const newValue = {
      ...this.searchState$.value,
      sort: sortMode.name,
      from: 0
    };
    this.searchState$.next(newValue);
  }
  public getNextPage(): void {
    const newValue = { ...this.searchState$.value };
    newValue.from =
      (this.searchState$.value.from || 0) + this.searchMode.results.pageSize;
    this.searchState$.next(newValue);
  }
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface): void {}

  private updateFilters(): void {
    this.filterFactory
      .getFilters(this.searchState$.value)
      .pipe(take(1))
      .subscribe(this.filters$.next);
  }

  private getMocks(): void {
    this.searchState$ = new BehaviorSubject<SearchStateInterface>(
      this.mockViewmodel.searchState$.value
    );
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }
}
