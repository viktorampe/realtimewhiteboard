import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SearchFilterCriteriaInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface,
  SortModeInterface
} from '../interfaces';
import { MockSearchViewModel } from './search.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class SearchViewModel {
  private searchMode: SearchModeInterface;
  private filterFactory: SearchFilterFactory;

  // source stream
  private filters$ = new BehaviorSubject<SearchFilterInterface[]>([]); // used by updateFilters()
  private results$ = new BehaviorSubject<SearchResultInterface>(null);

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
    // request new filters
    this.updateFilters();

    // trigger new search
    this.searchState$.next(newSearchState);
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

  public updateResult(result: SearchResultInterface): void {
    this.results$.next(result);
  }

  private updateFilters(): void {
    // implementation is another ticket (#689)
  }

  private getMocks(): void {
    this.searchState$ = new BehaviorSubject<SearchStateInterface>(
      this.mockViewmodel.searchState$.value
    );
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }
}
