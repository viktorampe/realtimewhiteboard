import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
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
  public searchState$: Subject<SearchStateInterface>;
  public searchFilters$: Subject<SearchFilterInterface[]>;

  private searchState: SearchStateInterface;
  private searchMode: SearchModeInterface;
  private filterFactory: SearchFilterFactory;
  // source streams
  private factoryFilters$: Subject<SearchFilterInterface[]>;

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
  }

  public reset(
    mode: SearchModeInterface,
    state: SearchStateInterface = null
  ): void {
    this.searchMode = mode;
    this.filterFactory = new this.searchMode.searchFilterFactory();

    if (state) {
      // we want to update the state
      this.searchState = state;
    } else {
      // we want to reset the state
      this.searchState.searchTerm = '';
      this.searchState.filterCriteriaSelections.clear();
      this.searchState.from = 0;
      this.searchState.sort = '';
    }

    this.filterFactory.getFilters([this.searchState]).pipe(
      take(1),
      switchMap((filters: SearchFilterInterface[]) => this.factoryFilters$)
    );

    this.searchState$.next({ ...this.searchState });
  }
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {}
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {}
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface): void {}

  private getMocks(): void {
    this.searchState$ = this.mockViewmodel.searchState$;
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }
}
