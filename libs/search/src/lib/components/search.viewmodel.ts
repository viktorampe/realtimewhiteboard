import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SearchFilterFactory,
  SearchFilterInterface,
  SearchResultInterface,
  SearchStateInterface
} from '../interfaces';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from './../interfaces/search-filter-criteria.interface';
import {
  SearchModeInterface,
  SortModeInterface
} from './../interfaces/search-mode-interface';
import { MockSearchViewModel } from './search.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class SearchViewModel {
  public searchState$: BehaviorSubject<SearchStateInterface>;
  public searchFilters$: BehaviorSubject<SearchFilterInterface[]>;

  private searchState: SearchStateInterface;
  private searchMode: SearchModeInterface;
  private filterFactory: SearchFilterFactory;

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
  }

  public reset(state: SearchStateInterface, mode: SearchModeInterface): void {}
  public changeSort(sortMode: SortModeInterface): void {}
  public getNextPage(): void {}
  public changeFilters(criteria: SearchFilterCriteriaInterface): void {
    // update state
    const updatedCriteria: Map<
      string,
      number[] | string[]
    > = this.extractSelectedValuesFromCriteria(criteria);

    const searchState: SearchStateInterface = this.searchState$.value;
    updatedCriteria.forEach((value, key) => {
      searchState.filterCriteriaSelections.set(key, value);
    });

    this.searchState$.next({ ...searchState, from: 0 });

    if (this.searchMode && this.searchMode.dynamicFilters) {
      // this.requestNewFilters();
    }
  }
  public changeSearchTerm(searchTerm: string): void {}
  public updateResult(result: SearchResultInterface): void {}

  private getMocks(): void {
    this.searchState$ = this.mockViewmodel.searchState$;
    this.searchFilters$ = this.mockViewmodel.searchFilters$;
  }

  private extractSelectedValuesFromCriteria(
    criteria: SearchFilterCriteriaInterface,
    filterCriteriaSelections = new Map()
  ): Map<string, number[] | string[]> {
    return criteria.values.reduce(
      (
        acc: Map<string, number[] | string[]>,
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
