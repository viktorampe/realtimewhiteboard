import { Injectable } from '@angular/core';
import { FavoriteInterface, LearningAreaInterface } from '@campus/dal';
import { SearchModeInterface, SearchStateInterface } from '@campus/search';
import { EduContentSearchResultInterface } from 'apps/polpo-classroom-web/src/app/components/searchresults/interfaces/educontent-search-result';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduContentsViewModel {
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface>;

  private searchState$: BehaviorSubject<SearchStateInterface>;
  private eduContentFavorites$: Observable<FavoriteInterface[]>;

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {}

  /*
   * make auto-complete request to api service and return observable
   */
  public requestAutoComplete(string): Observable<string[]> {
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
