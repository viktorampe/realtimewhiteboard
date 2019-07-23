import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  DiaboloPhaseInterface,
  DiaboloPhaseQueries,
  EduContent,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentFixture,
  EduContentInterface,
  EduContentProductTypeFixture,
  EduContentProductTypeInterface,
  EduContentProductTypeQueries,
  EduContentServiceInterface,
  EduContentTOCInterface,
  EduContentTocQueries,
  EDU_CONTENT_SERVICE_TOKEN,
  getRouterState,
  MethodInterface,
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
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';

interface CurrentMethodParams {
  book: number;
  chapter: number;
  lesson: number;
}

@Injectable({
  providedIn: 'root'
})
export class MethodViewModel {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$: Observable<SearchStateInterface>;

  // Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  private currentMethodParams$: Observable<CurrentMethodParams>;
  private currentBook$: Observable<EduContentBookInterface>;
  private currentMethod$: Observable<MethodInterface>;
  private generalFiles$: Observable<EduContentInterface[]>;
  private eduContentProductTypes$: Observable<EduContentProductTypeInterface[]>;
  private diaboloPhases$: Observable<DiaboloPhaseInterface[]>;

  // Presentation streams
  private currentToc$: Observable<EduContentTOCInterface[]>;

  private _searchState$: BehaviorSubject<SearchStateInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    private searchModes: EnvironmentSearchModesInterface
  ) {
    this.initialise();
  }

  private initialise() {
    this.setSourceStreams();
    this.setupSearchResults();
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

  setSourceStreams() {
    this._searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.searchState$ = this._searchState$;

    this.routerState$ = this.store.pipe(select(getRouterState));

    this.currentMethodParams$ = this.getCurrentMethodParams();
    this.currentBook$ = this.getCurrentBookStream();
    this.currentMethod$ = this.getCurrentMethodStream();
    this.currentToc$ = this.getTocsStream();

    this.generalFiles$ = this.getGeneralFilesStream();
    this.eduContentProductTypes$ = this.getEduContentProductTypesStream();
    this.diaboloPhases$ = this.getDiaboloPhasesStream();
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

  private getCurrentMethodParams() {
    return this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        book: +routerState.state.params.book,
        chapter: +routerState.state.params.chapter,
        lesson: +routerState.state.params.lesson
      }))
    );
  }

  private getCurrentBookStream() {
    const currentBookWhenEmpty$ = this.currentMethodParams$.pipe(
      filter(params => !params.book),
      mapTo(null)
    );

    const currentBookWhenExists$ = this.currentMethodParams$.pipe(
      filter(params => !!params.book),
      switchMap(currentMethodParams => {
        return this.store.pipe(
          select(EduContentBookQueries.getById, {
            id: currentMethodParams.book
          })
        );
      })
    );

    return merge(currentBookWhenEmpty$, currentBookWhenExists$);
  }

  private getCurrentMethodStream() {
    const currentMethodWhenBook$ = this.currentBook$.pipe(
      filter(book => !!book),
      map(book => {
        return book.method;
      })
    );

    const currentMethodWhenNoBook$ = this.currentBook$.pipe(
      filter(book => !book),
      mapTo(null)
    );

    return merge(currentMethodWhenBook$, currentMethodWhenNoBook$);
  }

  private getTocsStream() {
    const tocStreamWhenLessonChapter$ = this.currentMethodParams$.pipe(
      filter(params => !!params.lesson || !!params.chapter),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getTocsForToc, {
            tocId: params.lesson || params.chapter
          })
        );
      })
    );

    const tocStreamWhenBook$ = this.currentMethodParams$.pipe(
      filter(params => !!params.book && (!params.lesson && !params.chapter)),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getTocsForBook, {
            bookId: params.book
          })
        );
      })
    );

    const tocStreamWhenNoBook$ = this.currentMethodParams$.pipe(
      filter(params => !params.book),
      mapTo([])
    );

    return merge(
      tocStreamWhenLessonChapter$,
      tocStreamWhenBook$,
      tocStreamWhenNoBook$
    );
  }

  private getGeneralFilesStream() {
    const generalFilesWhenBook$ = this.currentMethodParams$.pipe(
      filter(params => !!params.book),
      switchMap(currentMethodParams => {
        return this.eduContentService.getGeneralEduContentsForBookId(
          currentMethodParams.book
        );
      })
    );

    const generalFilesWhenNoBook$ = this.currentMethodParams$.pipe(
      filter(params => !params.book),
      mapTo([])
    );

    return merge(generalFilesWhenBook$, generalFilesWhenNoBook$);
  }

  private getEduContentProductTypesStream() {
    return this.store.pipe(select(EduContentProductTypeQueries.getAll));
  }

  private getDiaboloPhasesStream() {
    return this.store.pipe(select(DiaboloPhaseQueries.getAll));
  }
}
