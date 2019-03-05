import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface,
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
  private filters$ = new BehaviorSubject<SearchFilterInterface[]>([]);
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
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {
    // update state
    const updatedCriteria: Map<
      string,
      (number | string)[]
    > = this.extractSelectedValuesFromCriteria(criteria);

    const searchState: SearchStateInterface = { ...this.searchState$.value };
    const selection = new Map(searchState.filterCriteriaSelections); // clone criteria
    updatedCriteria.forEach((value, key) => {
      selection.set(key, value);
    });
    searchState.filterCriteriaSelections = selection;
    searchState.from = 0;
    this.searchState$.next(searchState);

    if (this.searchMode && this.searchMode.dynamicFilters === true) {
      // request new filters
      this.updateFilters();
    }
  }
  public changeSearchTerm(searchTerm: string): void {}

  public updateResult(result: SearchResultInterface): void {
    this.results$.next(result);
  }

  private updateFilters(): void {
    this.filterFactory
      .getFilters(this.searchState$.value)
      .pipe(take(1))
      .subscribe(filters => this.filters$.next(filters));
  }

  private getMocks(): void {
    this.searchState$ = new BehaviorSubject<SearchStateInterface>(
      this.mockViewmodel.searchState$.value
    );
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }

  private extractSelectedValuesFromCriteria(
    criteria: SearchFilterCriteriaInterface,
    filterCriteriaSelections = new Map()
  ): Map<string, (number | string)[]> {
    return criteria.values.reduce(
      (
        acc: Map<string, (number | string)[]>,
        value: SearchFilterCriteriaValuesInterface
      ) => {
        // extract selected IDs
        if (value.selected) {
          if (!acc.has(criteria.name)) {
            acc.set(criteria.name, []);
          }
          acc.get(criteria.name).push(value.data[criteria.keyProperty]);
        }
        // check for selection in child
        if (value.child) {
          this.extractSelectedValuesFromCriteria(value.child, acc);
        }
        return acc;
      },
      filterCriteriaSelections
    );
  }
}
