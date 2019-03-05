import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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
  public searchFilters$: Observable<SearchFilterInterface[]>;

  constructor(private mockViewmodel: MockSearchViewModel) {
    this.getMocks();
    this.initiateStreams();
  }

  initiateStreams(): void {
    this.searchFilters$ = combineLatest(
      this.filters$,
      this.searchState$,
      this.results$
    ).pipe(
      map(([filters, state, results]) => {
        filters.forEach(filter => {
          //if array loop and get updatedCriterium for each
          if (Array.isArray(filter.criteria))
            filter.criteria.map(criterium =>
              this.getUpdatedCriterium(
                criterium,
                state.filterCriteriaSelections,
                results.filterCriteriaPredictions
              )
            );
          //if single get updatedCriterium
          else
            filter.criteria = this.getUpdatedCriterium(
              filter.criteria,
              state.filterCriteriaSelections,
              results.filterCriteriaPredictions
            );
        });
        //return updated filters
        return filters;
      })
    );
  }

  /**
   * updates the complete criteruym that is passed using the given selection and prediction data
   *
   * @private
   * @param {SearchFilterCriteriaInterface} criterium
   * @param {(Map<string, (number | string)[]>)} filterCriteriaSelections
   * @param {(Map<string, Map<string | number, number>>)} filterCriteriaPredictions
   * @returns {SearchFilterCriteriaInterface}
   * @memberof SearchViewModel
   */
  private getUpdatedCriterium(
    criterium: SearchFilterCriteriaInterface,
    filterCriteriaSelections: Map<string, (number | string)[]>,
    filterCriteriaPredictions: Map<string, Map<string | number, number>>
  ): SearchFilterCriteriaInterface {
    criterium.values.forEach(value => {
      value = this.getUpdatedCriteriumValue(
        criterium,
        value,
        filterCriteriaSelections,
        filterCriteriaPredictions
      );
    });
    return criterium;
  }

  /**
   * updates the value prediction, value selection and the complete child if there is a child
   *
   * @private
   * @param {SearchFilterCriteriaInterface} criterium
   * @param {SearchFilterCriteriaValuesInterface} value
   * @param {(Map<string, (number | string)[]>)} filterCriteriaSelections
   * @param {(Map<string, Map<string | number, number>>)} filterCriteriaPredictions
   * @returns {SearchFilterCriteriaValuesInterface}
   * @memberof SearchViewModel
   */
  private getUpdatedCriteriumValue(
    criterium: SearchFilterCriteriaInterface,
    value: SearchFilterCriteriaValuesInterface,
    filterCriteriaSelections: Map<string, (number | string)[]>,
    filterCriteriaPredictions: Map<string, Map<string | number, number>>
  ): SearchFilterCriteriaValuesInterface {
    // update prediction
    value.prediction = this.getUpdatedValuePrediction(
      criterium,
      value,
      filterCriteriaPredictions
    );
    // update selection
    value.selected = this.getUpdatedValueSelection(
      criterium,
      value,
      filterCriteriaSelections
    );
    // update child if there is a child
    if (value.child)
      value.child = this.getUpdatedCriterium(
        value.child,
        filterCriteriaSelections,
        filterCriteriaPredictions
      );
    return value;
  }

  /**
   * update the selection for the given value
   *
   * @private
   * @param {SearchFilterCriteriaInterface} criterium
   * @param {SearchFilterCriteriaValuesInterface} value
   * @param {(Map<string, (string | number)[]>)} filterCriteriaSelections
   * @returns {boolean}
   * @memberof SearchViewModel
   */
  private getUpdatedValueSelection(
    criterium: SearchFilterCriteriaInterface,
    value: SearchFilterCriteriaValuesInterface,
    filterCriteriaSelections: Map<string, (string | number)[]>
  ): boolean {
    //check if there is selection data
    const criteriaSelections = filterCriteriaSelections.get(
      value.data[criterium.name]
    );
    // if there is data and check if the selection is present or not, return true or false depending on data presence
    return criteriaSelections &&
      criteriaSelections.includes(value.data[criterium.keyProperty])
      ? true
      : false;
  }

  /**
   * update the selection for the given value
   *
   * @private
   * @param {SearchFilterCriteriaInterface} criterium
   * @param {SearchFilterCriteriaValuesInterface} value
   * @param {(Map<string, Map<string | number, number>>)} filterCriteriaPredictions
   * @returns {number}
   * @memberof SearchViewModel
   */
  private getUpdatedValuePrediction(
    criterium: SearchFilterCriteriaInterface,
    value: SearchFilterCriteriaValuesInterface,
    filterCriteriaPredictions: Map<string, Map<string | number, number>>
  ): number {
    //check if there is prediction data
    const criteriaPredictions = filterCriteriaPredictions.get(criterium.name);
    if (criteriaPredictions) {
      // if there is prediction data, check if there is prediction data for this value
      const criteriaPrediction = criteriaPredictions.get(
        value.data[criterium.keyProperty]
      );
      if (criteriaPrediction) {
        //if there is prediction data for this value, return the new prediction
        return criteriaPrediction.valueOf();
      }
    }
    //if there is no new prediction data, return the old data or 0
    return value.prediction || 0;
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
    // this.searchFilters$ = this.mockViewmodel.searchFilters$;
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
