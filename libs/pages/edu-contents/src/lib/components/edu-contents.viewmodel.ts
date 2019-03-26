import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteInterface,
  FavoriteQueries,
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
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  public learningArea$: Observable<LearningAreaInterface>;
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchTerm$ = new Subject<string>();
  public autoCompleteValues$: Observable<string[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;
  public eduContentFavorites$: Observable<FavoriteInterface[]>;

  private searchState$: BehaviorSubject<SearchStateInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    public searchModes: EnvironmentSearchModesInterface
  ) {
    this.initialize();
  }

  private initialize() {
    this.learningArea$ = this.getLearningArea();
    this.autoCompleteValues$ = this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => this.requestAutoComplete(searchTerm))
    );
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
  private requestAutoComplete(searchTerm: string): Observable<string[]> {
    return this.store.pipe(
      select(getRouterStateParams),
      map(params => new Map([['learningArea', [+params.area]]])),
      switchMap(criteria => {
        const searchState: SearchStateInterface = {
          searchTerm,
          filterCriteriaSelections: criteria
        };
        return this.eduContentService.autoComplete(searchState);
      })
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
    return;
  }

  /*
   * dispatch toggle action
   */
  public toggleFavoriteArea(area: LearningAreaInterface): void {}

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
