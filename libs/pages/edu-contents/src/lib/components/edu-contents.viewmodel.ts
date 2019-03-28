import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  BundleInterface,
  BundleQueries,
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteInterface,
  FavoriteQueries,
  getRouterStateParams,
  LearningAreaInterface,
  LearningAreaQueries,
  TaskInterface,
  TaskQueries
} from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import {
  EduContentSearchResultInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

const TASK = 'task';
const BUNDLE = 'bundle';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  public learningArea$: Observable<LearningAreaInterface>;
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;
  public eduContentFavorites$: Observable<FavoriteInterface[]>;

  private searchState$: BehaviorSubject<SearchStateInterface>;
  private routerStateParams$: Observable<RouterStateParamsInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    public searchModes: EnvironmentSearchModesInterface
  ) {
    this.setupStreams();
  }

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {
    this.searchState$.next(state);
    //TODO -- tests can only be added once the results method has been implemented and the results are updated due to a trigger on the stream that calls the api
  }

  /**
   * get learningarea for active route
   */
  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.store.pipe(
      select(getRouterStateParams),
      map((params: Params): number => +params.area),
      filter(id => !!id),
      switchMap(id =>
        this.store.pipe(select(LearningAreaQueries.getById, { id }))
      )
    );
  }

  /*
   * make auto-complete request to api service and return observable
   */
  public requestAutoComplete(searchTerm: string): Observable<string[]> {
    return this.getInitialSearchState().pipe(
      map(initialSearchState => {
        return { ...initialSearchState, searchTerm };
      }),
      switchMap(enrichedSearchState =>
        this.eduContentService.autoComplete(enrichedSearchState)
      )
    );
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
    return this.routerStateParams$.pipe(
      map((routerStateParams: RouterStateParamsInterface) => {
        const initialSearchState: SearchStateInterface = {
          searchTerm: '',
          filterCriteriaSelections: new Map<string, (number | string)[]>()
        };
        if (routerStateParams.area) {
          initialSearchState.filterCriteriaSelections.set('learningArea', [
            parseInt(routerStateParams.area, 10)
          ]);
        }
        if (routerStateParams.task) {
          initialSearchState.filterCriteriaOptions = new Map<
            string,
            number | string | boolean
          >();
          initialSearchState.filterCriteriaOptions.set('taskAllowed', true);
        }
        return initialSearchState;
      })
    );
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
      filter(searchState => !!searchState),
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
  private setupStreams(): void {
    this.learningArea$ = this.getLearningArea();
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));
    this.favoriteLearningAreas$ = this.getFavoriteLearningAreas();
    this.eduContentFavorites$ = this.store.pipe(
      select(FavoriteQueries.getByType, { type: 'educontent' })
    );
    this.routerStateParams$ = this.store.pipe(select(getRouterStateParams));

    this.searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.getInitialSearchState()
      .pipe(take(1))
      .subscribe(searchState => this.searchState$.next(searchState));

    this.setupSearchResults();
  }

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
  private getFavoriteLearningAreas(): Observable<LearningAreaInterface[]> {
    return this.store.pipe(
      select(FavoriteQueries.getByType, { type: 'area' }),
      map(
        (favorites): number[] =>
          favorites.map(favorite => favorite.learningAreaId)
      ),
      switchMap(
        (learningAreaIds): Observable<LearningAreaInterface[]> =>
          this.store.pipe(
            select(LearningAreaQueries.getByIds, { ids: learningAreaIds })
          )
      )
    );
  }
}

export interface RouterStateParamsInterface {
  area?: string;
  task?: string;
  [key: string]: string;
}
