import { Injectable } from '@angular/core';
import {
  DalState,
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
  public learningAreas$: Observable<LearningAreaInterface[]>;
  public favoriteLearningAreas$: Observable<LearningAreaInterface[]>;
  public searchResults$: Observable<EduContentSearchResultInterface[]>;
  public eduContentFavorites$: Observable<FavoriteInterface[]>;

  private searchState$: BehaviorSubject<SearchStateInterface>;

  constructor(private store: Store<DalState>) {
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
  public updateState(state: SearchStateInterface) {}

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

  private getFavoriteLearningAreas(): Observable<LearningAreaInterface[]> {
    return this.store.pipe(
      select(FavoriteQueries.getByType, { type: 'area' }),
      map(
        (favorites): { [key: number]: FavoriteInterface } => {
          const learningAreaIds: { [key: number]: FavoriteInterface } = {};
          favorites.forEach(favorite => {
            learningAreaIds[favorite.learningAreaId] = favorite;
          });
          return learningAreaIds;
        }
      ),
      switchMap(
        (learningAreaIds): Observable<LearningAreaInterface[]> => {
          return this.learningAreas$.pipe(
            map(
              (learningAreas): LearningAreaInterface[] =>
                learningAreas.filter(
                  learningArea => !!learningAreaIds[learningArea.id]
                )
            )
          );
        }
      )
    );
  }
}
