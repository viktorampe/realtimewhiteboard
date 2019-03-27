import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteInterface,
  FavoriteQueries,
  LearningAreaInterface,
  LearningAreaQueries
} from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import { EduContentSearchResultInterface } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  constructor(private store: Store<DalState>) {}

  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;
  public eduContentFavorites$: Observable<FavoriteInterface[]>;

  private searchState$: BehaviorSubject<SearchStateInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {
    this.initialize();
  }

  private initialize() {
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
    this.searchState$.next(state);
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
    return;
  }

  /*
   * determine the initial searchState from the router state store
   * can  be constructed from various parameters like querystring, ... TBD
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    const routerStateParams$ = this.store.pipe(select(getRouterStateParams));
    return combineLatest(this.searchState$, routerStateParams$).pipe(
      map(([searchState, routerStateParams]: [SearchStateInterface, any]) => {
        if (routerStateParams.area) {
          searchState.filterCriteriaSelections.set('learningArea', [
            parseInt(routerStateParams.area, 10)
          ]);
        }
        return searchState;
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
