import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContent,
  EduContentFixture,
  EduContentInterface,
  EduContentProductTypeFixture,
  EduContentServiceInterface,
  EDU_CONTENT_SERVICE_TOKEN,
  getRouterState,
  MethodQueries,
  MethodYearsInterface,
  RouterStateUrl
} from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MethodViewModel {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$: Observable<SearchStateInterface>;
  public methodYears$: Observable<MethodYearsInterface[]>;

  private _searchState$: BehaviorSubject<SearchStateInterface>;
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    private searchModes: EnvironmentSearchModesInterface,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {
    this.initialise();
  }

  private initialise() {
    this._searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.searchState$ = this._searchState$;
    this.routerState$ = this.store.pipe(select(getRouterState));
    this.methodYears$ = this.store.pipe(select(MethodQueries.getMethodYears));

    this.setupSearchResults();
  }

  /*
   * determine the searchMode for a given string
   */
  public getSearchMode(mode: string, book?: number): SearchModeInterface {
    return this.searchModes[mode];
  }

  /*
   * determine the initial searchState from the router state store
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    return this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => {
        const initialSearchState: SearchStateInterface = {
          searchTerm: '',
          filterCriteriaSelections: new Map<string, (number | string)[]>()
        };

        // if (routerState.state.params.book) {
        //   initialSearchState.filterCriteriaSelections.set('learningArea', [

        //   ]);
        // }

        return initialSearchState;
      })
    );
  }

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {
    this._searchState$.next(state);
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
      // switchMap(searchState => this.getMockResults()),
      map(searchResult => {
        return {
          ...searchResult,
          results: searchResult.results.map(
            (searchResultItem: EduContentInterface) => {
              const eduContent = Object.assign<EduContent, EduContentInterface>(
                new EduContent(),
                searchResultItem
              );

              return {
                eduContent: eduContent
                // add additional props for the resultItemComponent here
              };
            }
          )
        };
      })
    );
  }

  // tslint:disable-next-line: member-ordering
  private loadedMockResults = false;
  private getMockResults(): Observable<SearchResultInterface> {
    if (this.loadedMockResults) {
      return of({
        count: 3,
        results: [],
        filterCriteriaPredictions: new Map()
      });
    }
    this.loadedMockResults = true;

    return of({
      count: 3,
      results: [
        new EduContentFixture(
          {},
          {
            title: 'Aanliggende hoeken',
            description:
              'In dit leerobject maken leerlingen 3 tikoefeningen op aanliggende hoeken.',
            fileExt: 'ludo.zip'
          }
        ),
        new EduContentFixture(
          {},
          {
            thumbSmall:
              'https://avatars3.githubusercontent.com/u/31932368?s=460&v=4'
          }
        ),
        new EduContentFixture(
          {},
          {
            eduContentProductType: new EduContentProductTypeFixture({
              pedagogic: true
            })
          }
        )
      ],
      filterCriteriaPredictions: new Map([
        ['LearningArea', new Map([[1, 100], [2, 50]])]
      ])
    });
  }
}
