import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  FavoriteInterface,
  getRouterStateParams,
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

  public getLearningAreaById(
    areaId: number
  ): Observable<LearningAreaInterface> {
    return this.store.pipe(select(LearningAreaQueries.getById, { id: areaId }));
  }

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {}

  /*
   * make auto-complete request to api service and return observable
   */
  public requestAutoComplete(searchTerm: string): Observable<string[]> {
    return this.store.select(getRouterStateParams).pipe(
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

  /*
   * set the streams for favorites, learningAreas via store selectors
   */
  private setupStreams(): void {}
}
