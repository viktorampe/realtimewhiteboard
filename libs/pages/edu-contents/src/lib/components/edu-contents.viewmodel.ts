import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  BundleQueries,
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  getRouterState,
  LearningAreaInterface,
  LearningAreaQueries,
  RouterStateUrl,
  TaskInterface,
  TaskQueries
} from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import {
  EduContentSearchResultInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { MapObjectConversionService } from '@campus/utils';
import { RouterReducerState } from '@ngrx/router-store';
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
  public searchState$: Observable<SearchStateInterface>;

  private _searchState$: BehaviorSubject<SearchStateInterface>;
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    private mapObjectConversionService: MapObjectConversionService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    public searchModes: EnvironmentSearchModesInterface
  ) {
    this.setupStreams();
    this.initialize();
  }

  private initialize() {
    this._searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.searchState$ = this._searchState$;
    this.routerState$ = this.store.pipe(select(getRouterState));
    this.learningArea$ = this.getLearningArea();
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));
    this.favoriteLearningAreas$ = this.getFavoriteLearningAreas();
    this.eduContentFavorites$ = this.store.pipe(
      select(FavoriteQueries.getByType, { type: 'educontent' })
    );
  }

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {
    this._searchState$.next(state);
    //TODO -- tests can only be added once the results method has been implemented and the results are updated due to a trigger on the stream that calls the api
  }

  /**
   * get learningarea for active route
   */
  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routerState$.pipe(
      map(
        (routerState: RouterReducerState<RouterStateUrl>): number =>
          +routerState.state.params.area
      ),
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
    return this.searchModes[mode];
  }

  /*
   * determine the initial searchState from the router state store
   * can  be constructed from various parameters like querystring, ... TBD
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    return this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => {
        const initialSearchState: SearchStateInterface = {
          searchTerm: '',
          filterCriteriaSelections: new Map<string, (number | string)[]>()
        };
        if (
          routerState.state.queryParams &&
          routerState.state.queryParams.searchTerm
        ) {
          initialSearchState.searchTerm =
            routerState.state.queryParams.searchTerm;
        }
        if (routerState.state.params.area) {
          initialSearchState.filterCriteriaSelections.set('learningArea', [
            +routerState.state.params.area
          ]);
        }
        if (routerState.state.params.task) {
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
  public toggleFavoriteArea(area: LearningAreaInterface): void {
    const favorite: FavoriteInterface = {
      name: area.name,
      type: FavoriteTypesEnum.AREA,
      learningAreaId: area.id,
      created: new Date()
    };
    this.store.dispatch(new FavoriteActions.ToggleFavorite({ favorite }));
  }

  /*
   * dispatch save action for search state
   */
  public saveSearchState(searchState: SearchStateInterface): void {
    const favorite: FavoriteInterface = {
      name: 'Zoekopdracht',
      type: FavoriteTypesEnum.SEARCH,
      criteria: JSON.stringify({
        ...searchState,
        filterCriteriaSelections: this.mapObjectConversionService.mapToObject(
          searchState.filterCriteriaSelections
        )
      }),
      created: new Date()
    };
    this.store.dispatch(
      new FavoriteActions.StartAddFavorite({
        favorite,
        userId: this.authService.userId
      })
    );
  }

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
    this.routerState$ = this.store.pipe(select(getRouterState));
    this._searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.searchState$ = this._searchState$;

    this.getInitialSearchState()
      .pipe(take(1))
      .subscribe(searchState => this._searchState$.next(searchState));

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
