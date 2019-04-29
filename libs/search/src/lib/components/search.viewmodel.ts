import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import {
  map,
  skipWhile,
  startWith,
  take,
  withLatestFrom
} from 'rxjs/operators';
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

  constructor(private injector: Injector) {
    this.initiateStreams();
  }

  private initiateStreams(): void {
    this.searchFilters$ = zip(
      this.results$.pipe(skipWhile(result => !result)), // skip initial value
      this.filters$.pipe(skipWhile(filters => !filters.length)) // skip initial value
    ).pipe(
      withLatestFrom(this.searchState$),
      map(([[results, filters], state]) => {
        const filterCriteriaSelections = !!state
          ? state.filterCriteriaSelections
          : new Map<string, (number | string)[]>();
        const filterCriteriaPredictions = !!results
          ? results.filterCriteriaPredictions
          : new Map<string, Map<string | number, number>>();
        return filters.map(filter =>
          this.getUpdatedSearchFilter(
            filter,
            filterCriteriaSelections,
            filterCriteriaPredictions
          )
        );
      }),
      startWith([]) // intial value -> empty array of filters
    );
  }

  /**
   * updates and returns the given filter using the given state and results sets
   *
   * @private
   * @param {SearchFilterInterface} filter
   * @param {SearchStateInterface} state
   * @param {SearchResultInterface} results
   * @returns {SearchFilterInterface}
   * @memberof SearchViewModel
   */
  private getUpdatedSearchFilter(
    filter: SearchFilterInterface,
    stateFilterCriteriaSelections: Map<string, (number | string)[]>,
    resultsFilterCriteriaPredictions: Map<string, Map<string | number, number>>
  ): SearchFilterInterface {
    if (!filter) return;

    if (Array.isArray(filter.criteria))
      filter.criteria = filter.criteria.map(criterium =>
        this.getUpdatedCriterium(
          criterium,
          stateFilterCriteriaSelections,
          resultsFilterCriteriaPredictions
        )
      );
    //if single get updatedCriterium
    else {
      filter.criteria = this.getUpdatedCriterium(
        filter.criteria,
        stateFilterCriteriaSelections,
        resultsFilterCriteriaPredictions
      );
    }

    return filter;
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
    criterium.values = criterium.values.map(value =>
      this.getUpdatedCriteriumValue(
        criterium,
        value,
        filterCriteriaSelections,
        filterCriteriaPredictions
      )
    );
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
    const criteriaSelections = filterCriteriaSelections.get(criterium.name);

    return (
      !!criteriaSelections &&
      criteriaSelections.includes(value.data[criterium.keyProperty])
    );
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
      if (criteriaPrediction !== undefined) {
        //if there is prediction data for this value, return the new prediction
        return criteriaPrediction;
      }
    }
    //if there is no new prediction data, return the old data or 0
    return value.prediction === undefined ? null : value.prediction;
  }

  public reset(
    mode: SearchModeInterface,
    state: SearchStateInterface = null
  ): void {
    let newSearchState: SearchStateInterface;
    this.searchMode = mode;
    this.filterFactory = this.injector.get(this.searchMode.searchFilterFactory); // used by updateFilters()

    if (state) {
      // we want to update the state
      newSearchState = { ...state };
    } else {
      // we want to reset the state
      // note: sort mode should stay the same on reset
      newSearchState = { ...this.searchState$.value };
      newSearchState.searchTerm = '';
      newSearchState.from = 0;
    }
    this.setFilterCriteria(newSearchState, null);
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

  public changeFilters(
    criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  ): void {
    // update state
    const searchState: SearchStateInterface = { ...this.searchState$.value };
    this.setFilterCriteria(searchState, criteria);
    searchState.from = 0;
    this.searchState$.next(searchState);

    // update filters
    if (this.searchMode) {
      if (this.searchMode.dynamicFilters === true) {
        // request new filters
        // response from factory will trigger emit
        this.updateFilters();
      } else {
        // emit unchanged value
        // needed for searchFilter$
        // -> zip() needs new emit
        this.filters$.next(this.filters$.value);
      }
    }
  }
  public changeSearchTerm(searchTerm: string): void {
    const newValue = { ...this.searchState$.value };
    newValue.from = 0;
    newValue.searchTerm = searchTerm;
    this.searchState$.next(newValue);
  }

  public updateResult(result: SearchResultInterface): void {
    // check searchState if is a results refresh
    // -> if so, keep current predictions
    if (
      this.searchState$.value &&
      this.searchState$.value.from !== 0 &&
      this.results$.value
    ) {
      result.filterCriteriaPredictions = this.results$.value.filterCriteriaPredictions;
    }

    this.results$.next(result);
  }

  private updateFilters(): void {
    this.filterFactory
      .getFilters(this.searchState$.value)
      .pipe(take(1))
      .subscribe(filters => this.filters$.next(filters));
  }

  private extractSelectedValuesFromCriteria(
    criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[],
    filterCriteriaSelections = new Map()
  ): Map<string, (number | string)[]> {
    if (Array.isArray(criteria)) {
      return criteria.reduce(
        (
          acc: Map<string, (number | string)[]>,
          crit: SearchFilterCriteriaInterface
        ) => {
          this.extractSelectedValuesFromCriteria(crit, acc);
          return acc;
        },
        filterCriteriaSelections
      );
    } else {
      return criteria.values.reduce(
        (
          acc: Map<string, (number | string)[]>,
          value: SearchFilterCriteriaValuesInterface
        ) => {
          if (!acc.has(criteria.name)) {
            acc.set(criteria.name, []);
          }

          // extract selected IDs
          if (value.selected) {
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

  private setFilterCriteria(
    searchState: SearchStateInterface,
    criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  ) {
    const selection = new Map(searchState.filterCriteriaSelections); // clone criteria

    // re-set selected values
    if (criteria) {
      const updatedCriteria: Map<
        string,
        (number | string)[]
      > = this.extractSelectedValuesFromCriteria(criteria);

      updatedCriteria.forEach((value, key) => {
        selection.set(key, value);
      });
    }

    searchState.filterCriteriaSelections.clear();
    searchState.filterCriteriaSelections = selection;

    // add filterCriteria for predictions
    this.filterFactory.getPredictionFilterNames(searchState).forEach(name => {
      if (!selection.has(name)) selection.set(name, []);
    });
  }
}
