import { Inject, Injectable } from '@angular/core';
import {
  BundleInterface,
  BundleQueries,
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteInterface,
  LearningAreaInterface,
  TaskInterface,
  TaskQueries
} from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import { EduContentSearchResultInterface } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';

const LEARNINGAREA = 'learningArea';
const TASK = 'task';
const BUNDLE = 'bundle';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;

  private searchState$: BehaviorSubject<SearchStateInterface>;
  private eduContentFavorites$: Observable<FavoriteInterface[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {}

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {}

  /*
   * make auto-complete request to api service and return observable
   */
  public requestAutoComplete(searchTerm: string): Observable<string[]> {
    return;
  }

  /*
   * determine the searchMode for a given string
   */
  public getSearchMode(mode: string): SearchModeInterface {
    return;
  }

  /*
   * determine the initial searchState from the router state store
   * can  be constructed from various parameters like querystring, ... TBD
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    return;
  }

  /*
   * dispatch toggle action
   */
  public toggleFavoriteArea(area: LearningAreaInterface): void {}

  /*
   * make a result stream derived from :
   * - combining into a searchState -> done in getInitialSearchState
   * - switch map that to an api request
   * - map that to an EduContentSearchResultInterface
   */
  private setupSearchResults(): void {
    this.searchResults$ = this.searchState$.pipe(
      switchMap(searchState => this.eduContentService.search(searchState)),
      withLatestFrom(this.searchState$),
      map(([searchResult, searchState]) => {
        let adjustedSearchResults: EduContentSearchResultInterface[] =
          searchResult.results;

        adjustedSearchResults = this.adjustSearchResultsForTask(
          searchState,
          adjustedSearchResults
        );

        adjustedSearchResults = this.adjustSearchResultsForBundle(
          searchState,
          adjustedSearchResults
        );

        return adjustedSearchResults;
      })
    );
  }

  /*
   * set the streams for favorites, learningAreas via store selectors
   */
  private setupStreams(): void {}

  private adjustSearchResultsForTask(
    searchState: SearchStateInterface,
    searchResults: EduContentSearchResultInterface[]
  ): EduContentSearchResultInterface[] {
    if (
      searchState.filterCriteriaSelections.has(TASK) &&
      searchState.filterCriteriaSelections.get(TASK).length === 1
    ) {
      // get value from Store synchronously
      let currentTask: TaskInterface;
      const id = searchState.filterCriteriaSelections.get(TASK)[0];
      this.store
        .pipe(
          select(TaskQueries.getById, { id }),
          take(1)
        )
        .subscribe(task => (currentTask = task));

      searchResults.forEach(result => {
        result.inTask = true;
        result.currentTask = currentTask;
      });
    } else {
      searchResults.forEach(result => {
        result.inTask = false;
      });
    }

    return searchResults;
  }

  private adjustSearchResultsForBundle(
    searchState: SearchStateInterface,
    searchResults: EduContentSearchResultInterface[]
  ): EduContentSearchResultInterface[] {
    if (
      searchState.filterCriteriaSelections.has(BUNDLE) &&
      searchState.filterCriteriaSelections.get(BUNDLE).length === 1
    ) {
      // get value from Store synchronously
      let currentBundle: BundleInterface;
      const id = searchState.filterCriteriaSelections.get(BUNDLE)[0];
      this.store
        .pipe(
          select(BundleQueries.getById, { id }),
          take(1)
        )
        .subscribe(bundle => (currentBundle = bundle));

      searchResults.forEach(result => {
        result.inBundle = true;
        result.currentBundle = currentBundle;
      });
    } else {
      searchResults.forEach(result => {
        result.inBundle = false;
      });
    }

    return searchResults;
  }
}
