import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  BundleQueries,
  DalState,
  EduContent,
  EduContentInterface,
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
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  EduContentSearchResultInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { MapObjectConversionService } from '@campus/utils';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';

const TASK = 'task';
const BUNDLE = 'bundle';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  public learningArea$: Observable<LearningAreaInterface>;
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<SearchResultInterface>;
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

    this.setupSearchResults();
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

  /**
   * get task for active route
   */
  private getTask(): Observable<TaskInterface> {
    const router$ = this.routerState$.pipe(
      map(
        (routerState: RouterReducerState<RouterStateUrl>): number =>
          +routerState.state.params.task
      )
    );

    const task$ = router$.pipe(
      filter(id => !!id),
      switchMap(id => this.store.pipe(select(TaskQueries.getById, { id })))
    );

    const emptyTask$ = router$.pipe(
      filter(id => !id),
      mapTo(null)
    );

    return merge(task$, emptyTask$);
  }

  /**
   * get bundle for active route
   */
  private getBundle(): Observable<BundleInterface> {
    const router$ = this.routerState$.pipe(
      map(
        (routerState: RouterReducerState<RouterStateUrl>): number =>
          +routerState.state.params.bundle
      )
    );

    const bundle$ = router$.pipe(
      filter(id => !!id),
      switchMap(id => this.store.pipe(select(BundleQueries.getById, { id })))
    );

    const emptyBundle$ = router$.pipe(
      filter(id => !id),
      mapTo(null)
    );

    return merge(bundle$, emptyBundle$);
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
  public getSearchMode(mode: string, area?: number): SearchModeInterface {
    //Only use globalterm if we're in a term mode with no learning area selected
    if (!area && mode === 'term') return this.searchModes['globalterm'];
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

  private setupSearchResults(): void {
    this.searchResults$ = this.searchState$.pipe(
      filter(searchState => searchState !== null),
      withLatestFrom(this.getInitialSearchState()),
      map(([searchState, initialSearchState]) => ({
        ...initialSearchState,
        ...searchState,
        filterCriteriaSelections: new Map([
          ...Array.from(searchState.filterCriteriaSelections.entries()),
          ...Array.from(initialSearchState.filterCriteriaSelections.entries())
        ])
      })),
      switchMap(searchState => this.eduContentService.search(searchState)),
      withLatestFrom(this.getTask(), this.getBundle()),
      map(([searchResult, task, bundle]) => {
        return {
          ...searchResult,
          results: searchResult.results.map(
            (
              searchResultItem: EduContentInterface
            ): EduContentSearchResultInterface => {
              const eduContent = Object.assign<EduContent, EduContentInterface>(
                new EduContent(),
                searchResultItem
              );

              return {
                eduContent: eduContent,
                currentTask: task || undefined,
                inTask: !!task,
                currentBundle: bundle || undefined,
                inBundle: !!bundle
              };
            }
          )
        };
      })
    );
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
