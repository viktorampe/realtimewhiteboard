import { Injectable, Injector } from '@angular/core';
import { SearchResultInterface, SearchStateInterface } from '@campus/dal';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, share, startWith, take } from 'rxjs/operators';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface,
  SearchFilterFactory,
  SearchFilterInterface,
  SearchModeInterface,
  SortModeInterface
} from '../interfaces';

@Injectable()
export class SearchViewModel {
  public searchState$ = new BehaviorSubject<SearchStateInterface>(null);
  public searchFilters$: Observable<SearchFilterInterface[]>;

  private results$ = new BehaviorSubject<SearchResultInterface>(null);

  // observable that emits when all data is available to construct new SearchFilters
  private searchFilterData$: BehaviorSubject<{
    state: SearchStateInterface;
    predictions: Map<string, Map<string | number, number>>;
    factoryFilters: SearchFilterInterface[];
  }> = new BehaviorSubject(null);

  // caches data for searchFilterData$
  private _predictionsCache: Map<string, Map<string | number, number>>;
  private _factoryFiltersCache: SearchFilterInterface[];

  private searchMode: SearchModeInterface;
  private filterFactory: SearchFilterFactory;

  constructor(private injector: Injector) {
    this.initiateStreams();
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
      newSearchState = {
        ...state,
        sort:
          (this.searchState$.value && this.searchState$.value.sort) || // the current sort mode
          state.sort || // the one in the initial state
          mode.results.sortModes[0].name // the first one defined in the searchMode
      };
    } else {
      // we want to reset the state
      // note: sort mode should stay the same on reset
      newSearchState = { ...this.searchState$.value };
      newSearchState.searchTerm = '';
      newSearchState.from = 0;
      newSearchState.filterCriteriaSelections = new Map();
    }
    this.setFilterCriteria(newSearchState, null);
    // trigger new search
    this.searchState$.next(newSearchState);
    this.clearSearchFilterDataCache();

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

  public updateFilterCriteria(
    criteria: SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  ): void {
    // update state
    const searchState: SearchStateInterface = { ...this.searchState$.value };
    this.setFilterCriteria(searchState, criteria);
    searchState.from = 0;
    this.searchState$.next(searchState);
    this.clearSearchFilterDataCache();

    // update filters
    if (this.searchMode) {
      if (this.searchMode.dynamicFilters === true) {
        // request new filters
        // response from factory will trigger emit
        this.updateFilters();
      }
    }
  }
  public changeSearchTerm(searchTerm: string): void {
    const newValue = { ...this.searchState$.value };
    newValue.from = 0;
    newValue.searchTerm = searchTerm;
    this.searchState$.next(newValue);
    this.clearSearchFilterDataCache();
  }

  public updateResult(result: SearchResultInterface): void {
    if (!result) return;

    this.results$.next(result);
    this.setPredictionsCache(result);
  }

  private setFactoryFilterCache(factoryFilters: SearchFilterInterface[]) {
    this._factoryFiltersCache = factoryFilters;
    this.checkSearchFilterDataCache();
  }

  private setPredictionsCache(results: SearchResultInterface) {
    if (results.filterCriteriaPredictions.size !== 0) {
      this._predictionsCache = results.filterCriteriaPredictions;
    }
    this.checkSearchFilterDataCache();
  }

  // check if suffient data is present to emit new SearchFilterData
  private checkSearchFilterDataCache() {
    if (this._predictionsCache && this._factoryFiltersCache) {
      this.searchFilterData$.next({
        state: this.searchState$.value,
        predictions: this._predictionsCache,
        factoryFilters: this._factoryFiltersCache
      });

      this.clearSearchFilterDataCache();
    }
  }

  private clearSearchFilterDataCache() {
    if (this.searchMode && this.searchMode.dynamicFilters)
      this._factoryFiltersCache = null;
    this._predictionsCache = null;
  }

  private initiateStreams(): void {
    this.searchFilters$ = this.searchFilterData$.pipe(
      filter(data => !!data),
      map(({ predictions, factoryFilters, state }) => {
        return factoryFilters.map(factoryFilter =>
          this.getUpdatedSearchFilter(
            factoryFilter,
            state.filterCriteriaSelections,
            predictions
          )
        );
      }),
      startWith([]), // intial value -> empty array of filters
      share()
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
    searchFilter: SearchFilterInterface,
    stateFilterCriteriaSelections: Map<string, (number | string)[]>,
    resultsFilterCriteriaPredictions: Map<string, Map<string | number, number>>
  ): SearchFilterInterface {
    if (!searchFilter) return;

    if (Array.isArray(searchFilter.criteria)) {
      searchFilter.criteria = searchFilter.criteria.map(criterium =>
        this.getUpdatedCriterium(
          criterium,
          stateFilterCriteriaSelections,
          resultsFilterCriteriaPredictions
        )
      );
    }
    //if single get updatedCriterium
    else {
      searchFilter.criteria = this.getUpdatedCriterium(
        searchFilter.criteria,
        stateFilterCriteriaSelections,
        resultsFilterCriteriaPredictions
      );
    }

    return searchFilter;
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
      } else {
        //if there is no prediction data for this value, return 0
        return 0;
      }
    }
    //if there is no new prediction data, return the old data or 0
    return value.prediction === undefined ? 0 : value.prediction;
  }

  private updateFilters(): void {
    this.filterFactory
      .getFilters(this.searchState$.value)
      .pipe(take(1))
      .subscribe(filters => this.setFactoryFilterCache(filters));
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

    searchState.filterCriteriaSelections = selection;

    // add filterCriteria for predictions
    this.filterFactory.getPredictionFilterNames(searchState).forEach(name => {
      if (!selection.has(name)) selection.set(name, []);
    });
  }
}
