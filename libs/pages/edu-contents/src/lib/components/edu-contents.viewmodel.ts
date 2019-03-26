import { Injectable } from '@angular/core';
import {
  DalState,
  FavoriteInterface,
  getRouterStateParams,
  LearningAreaInterface
} from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import { EduContentSearchResultInterface } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  constructor(private store: Store<DalState>) {}

  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;

  private searchState$: BehaviorSubject<SearchStateInterface>;
  private eduContentFavorites$: Observable<FavoriteInterface[]>;

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
    const routerStateParams$ = this.store.pipe(select(getRouterStateParams));
    return combineLatest(this.searchState$, routerStateParams$).pipe(
      map(([searchState, routerStateParams]: [SearchStateInterface, any]) => {
        console.log(searchState);
        console.log(routerStateParams);
        console.log(routerStateParams.area);
        if (routerStateParams.area) {
          console.log(routerStateParams.area);
          searchState.filterCriteriaSelections.set('learningArea', [
            parseInt(routerStateParams.area, 10)
          ]);
        }
        console.log(searchState);
        return searchState;
      })
    );
    // return this.store.pipe(
    //   select(getRouterStateParams),
    //   map(routerStateParams => {
    //     const searchState = { ...this.searchState$.value };
    //     console.log(searchState.filterCriteriaSelections);
    //     if (routerStateParams.area) {
    //       console.log(routerStateParams.area);
    //       searchState.filterCriteriaSelections.set('learningArea', [
    //         routerStateParams.area
    //       ]);
    //     }
    //     console.log(routerStateParams);
    //     console.log(searchState.filterCriteriaSelections);
    //     console.log(searchState);
    //     return searchState;
    //   })
    // );
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
