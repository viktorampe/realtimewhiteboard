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

  private searchState$: BehaviorSubject<SearchStateInterface>;
  private routerStateParams$: Observable<RouterStateParamsInterface>;

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
    this.learningAreas$ = this.store.pipe(select(LearningAreaQueries.getAll));
    this.favoriteLearningAreas$ = this.getFavoriteLearningAreas();
    this.eduContentFavorites$ = this.store.pipe(
      select(FavoriteQueries.getByType, { type: 'educontent' })
    );
    this.routerStateParams$ = this.store.pipe(select(getRouterStateParams));
    this.searchState$ = new BehaviorSubject<SearchStateInterface>(null);
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

export interface RouterStateParamsInterface {
  area?: string;
  task?: string;
  [key: string]: string;
}
