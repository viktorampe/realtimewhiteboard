import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  getRouterStateParams,
  LearningAreaInterface,
  LearningAreaQueries
} from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import {
  EduContentSearchResultInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { MapObjectConversionService } from '@campus/utils';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  public learningArea$: Observable<LearningAreaInterface>;
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;
  public eduContentFavorites$: Observable<FavoriteInterface[]>;

  public searchState$: BehaviorSubject<SearchStateInterface>;

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
  public updateState(state: SearchStateInterface) {}

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
    this.searchState$.value.searchTerm = searchTerm;
    return this.eduContentService.autoComplete(this.searchState$.value);
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
    return;
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
   * - combining into a searchState
   *   - current location in app (in bundle, in task, in learning-area)
   *   - search component state observable
   * - switch map that to an api request
   * - map that to an EduContentSearchResultInterface
   */
  private setupSearchResults(): void {}

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
