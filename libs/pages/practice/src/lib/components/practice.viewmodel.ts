import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupInterface,
  ClassGroupQueries,
  DalState,
  EduContent,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentInterface,
  EduContentServiceInterface,
  EduContentTOCInterface,
  EduContentTocQueries,
  EDU_CONTENT_SERVICE_TOKEN,
  getRouterState,
  MethodLevelQueries,
  MethodQueries,
  MethodYearsInterface,
  ResultQueries,
  RouterStateUrl,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeInterface,
  UnlockedFreePracticeQueries
} from '@campus/dal';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import {
  ContentOpenerInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { Dictionary } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  zip
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  shareReplay,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import {
  ChapterWithStatusInterface,
  getChaptersWithStatuses,
  getUnlockedBooks,
  UnlockedBookInterface
} from './practice.viewmodel.selectors';

export interface CurrentPracticeParams {
  book?: number;
  chapter?: number;
  lesson?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PracticeViewModel implements ContentOpenerInterface {
  //Presentation streams
  public currentPracticeParams$: Observable<CurrentPracticeParams>;
  public bookTitle$: Observable<string>;
  public bookChapters$: Observable<EduContentTOCInterface[]>;
  public currentChapter$: Observable<EduContentTOCInterface>;
  public chapterLessons$: Observable<EduContentTOCInterface[]>;
  public filteredClassGroups$: Observable<ClassGroupInterface[]>;
  public methodYears$: Observable<MethodYearsInterface[]>;
  public unlockedFreePracticeByEduContentTOCId$: Observable<
    Dictionary<UnlockedFreePracticeInterface[]>
  >;
  public unlockedFreePracticeByEduContentBookId$: Observable<
    Dictionary<UnlockedFreePracticeInterface[]>
  >;
  public unlockedBooks$: Observable<UnlockedBookInterface[]>;
  public bookChaptersWithStatus$: Observable<ChapterWithStatusInterface[]>;

  public searchResults$: Observable<SearchResultInterface>;
  public searchState$: Observable<SearchStateInterface>;

  private _searchState$: BehaviorSubject<SearchStateInterface>;

  //Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  private currentBook$: Observable<EduContentBookInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    private searchModes: EnvironmentSearchModesInterface,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface
  ) {
    this.initialize();
  }

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {
    this._searchState$.next(state);
  }

  public toggleUnlockedFreePractice(
    unlockedFreePractices: UnlockedFreePracticeInterface[],
    checked: boolean
  ): void {
    if (checked) {
      this.store.dispatch(
        new UnlockedFreePracticeActions.StartAddManyUnlockedFreePractices({
          userId: this.authService.userId,
          unlockedFreePractices
        })
      );
    } else {
      const ufps$ = unlockedFreePractices.map(ufp => {
        return this.store.pipe(
          select(UnlockedFreePracticeQueries.findOne, ufp),
          take(1)
        );
      });

      zip(...ufps$).subscribe(ufps => {
        const ids = ufps.filter(ufp => !!ufp).map(ufp => ufp.id);

        this.store.dispatch(
          new UnlockedFreePracticeActions.DeleteUnlockedFreePractices({
            userId: this.authService.userId,
            ids
          })
        );
      });
    }
  }

  /*
   * determine the searchMode for a given string
   */
  public getSearchMode(mode: string): Observable<SearchModeInterface> {
    return of(this.searchModes[mode]);
  }

  /*
   * determine the initial searchState from the router state store
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    return this.currentPracticeParams$.pipe(
      withLatestFrom(this.currentBook$),
      map(([currentPracticeParams, currentBook]) => {
        const initialSearchState: SearchStateInterface = {
          searchTerm: null,
          filterCriteriaSelections: new Map<string, (number | string)[]>()
        };

        initialSearchState.filterCriteriaSelections.set('methods', [
          currentBook.methodId
        ]);

        initialSearchState.filterCriteriaSelections.set('eduContent.type', [
          'exercise'
        ]);

        if (currentPracticeParams && currentPracticeParams.chapter) {
          initialSearchState.filterCriteriaSelections.set('eduContentTOC', [
            currentPracticeParams.lesson
              ? currentPracticeParams.lesson
              : currentPracticeParams.chapter
          ]);
        }

        return initialSearchState;
      })
    );
  }

  private initialize() {
    this.setSourceStreams();
    this.setPresentationStreams();
    this.setupSearchResults();
  }

  private setSourceStreams() {
    this._searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.searchState$ = this._searchState$;

    this.routerState$ = this.store.pipe(select(getRouterState));
    this.currentPracticeParams$ = this.getCurrentPracticeParamsStream();

    this.currentBook$ = this.getCurrentBookStream();
    this.unlockedFreePracticeByEduContentTOCId$ = this.store.pipe(
      select(UnlockedFreePracticeQueries.getGroupedByEduContentTOCId)
    );
    this.unlockedFreePracticeByEduContentBookId$ = this.store.pipe(
      select(UnlockedFreePracticeQueries.getGroupedByEduContentBookId)
    );
  }

  private setPresentationStreams() {
    this.bookTitle$ = this.getBookTitleStream();
    this.bookChapters$ = this.getBookChaptersStream();
    this.currentChapter$ = this.getCurrentBookChapterStream();
    this.chapterLessons$ = this.getChapterLessonStream();
    this.filteredClassGroups$ = this.getFilteredClassGroupsStream();
    this.methodYears$ = this.store.pipe(
      select(MethodQueries.getAllowedMethodYears)
    );
    this.unlockedBooks$ = this.store.pipe(select(getUnlockedBooks));
    this.bookChaptersWithStatus$ = this.currentPracticeParams$.pipe(
      switchMap(params =>
        this.store.pipe(
          select(getChaptersWithStatuses, { bookId: params.book })
        )
      )
    );
  }

  private getCurrentPracticeParamsStream(): Observable<CurrentPracticeParams> {
    return this.routerState$.pipe(
      filter(routerState => !!routerState),
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        book: +routerState.state.params.book || undefined,
        chapter: +routerState.state.params.chapter || undefined,
        lesson: +routerState.state.params.lesson || undefined
      })),
      distinctUntilChanged(
        (a, b) =>
          a.book === b.book && a.chapter === b.chapter && a.lesson === b.lesson
      ),
      shareReplay(1)
    );
  }

  private getCurrentBookStream(): Observable<EduContentBookInterface> {
    const currentBookWhenEmpty$ = this.currentPracticeParams$.pipe(
      filter(params => !params.book),
      mapTo(null)
    );

    const currentBookWhenExists$ = this.currentPracticeParams$.pipe(
      filter(params => !!params.book),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentBookQueries.getById, {
            id: params.book
          })
        );
      })
    );

    return merge(currentBookWhenEmpty$, currentBookWhenExists$);
  }

  private getBookTitleStream(): Observable<string> {
    const bookTitleWhenNoBookId$ = this.currentPracticeParams$.pipe(
      filter(params => !params.book),
      mapTo(null)
    );

    const bookTitleWhenBookId$ = this.currentPracticeParams$.pipe(
      filter(params => !!params.book),
      switchMap(params => {
        return this.store.pipe(
          select(MethodQueries.getMethodWithYearByBookId, {
            id: params.book
          })
        );
      })
    );

    return merge(bookTitleWhenNoBookId$, bookTitleWhenBookId$);
  }

  private getBookChaptersStream(): Observable<EduContentTOCInterface[]> {
    const chaptersStreamWhenNoBookId$ = this.currentPracticeParams$.pipe(
      filter(params => !params.book),
      mapTo([])
    );

    const chaptersStreamWhenBookId$ = this.currentPracticeParams$.pipe(
      filter(params => !!params.book),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getChaptersForBook, {
            bookId: params.book
          })
        );
      })
    );

    return merge(chaptersStreamWhenNoBookId$, chaptersStreamWhenBookId$);
  }

  private getCurrentBookChapterStream(): Observable<EduContentTOCInterface> {
    const currentChapterStreamWhenNoChapterId$ = this.currentPracticeParams$.pipe(
      filter(params => !params.chapter),
      mapTo(null)
    );

    const currentChapterStreamWhenChapterId$ = this.currentPracticeParams$.pipe(
      filter(params => !!params.chapter),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getById, {
            id: params.chapter
          })
        );
      })
    );

    return merge(
      currentChapterStreamWhenNoChapterId$,
      currentChapterStreamWhenChapterId$
    );
  }

  private getChapterLessonStream(): Observable<EduContentTOCInterface[]> {
    const lessonsStreamWhenNoChapterId$ = this.currentPracticeParams$.pipe(
      filter(params => !params.chapter),
      mapTo([])
    );

    const lessonsStreamWhenChapterId$ = this.currentPracticeParams$.pipe(
      filter(params => !!params.chapter),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getTocsForToc, {
            tocId: params.chapter
          })
        );
      })
    );

    return merge(lessonsStreamWhenNoChapterId$, lessonsStreamWhenChapterId$);
  }

  private getFilteredClassGroupsStream(): Observable<ClassGroupInterface[]> {
    return this.currentBook$.pipe(
      filter(currentBook => !!currentBook),
      switchMap(currentBook => {
        return this.store.pipe(
          select(ClassGroupQueries.getClassGroupsForBook, {
            id: currentBook.id,
            filterByYear: false
          })
        );
      })
    );
  }
  public openEduContentAsExercise(eduContent: EduContent): void {
    combineLatest([
      this.currentPracticeParams$,
      this.unlockedFreePracticeByEduContentBookId$
    ])
      .pipe(
        map(
          ([routeParams, ufpByBookId]): UnlockedFreePracticeInterface => {
            // can be either shared by book or by chapter
            return ufpByBookId[routeParams.book].reduce((bestMatch, ufp) => {
              if (bestMatch === null && ufp.eduContentTOCId === null) {
                return ufp;
              }
              if (ufp.eduContentTOCId === routeParams.chapter) {
                return ufp;
              }
              return bestMatch;
            }, null);
          }
        ),
        take(1)
      )
      .subscribe(ufp => {
        this.scormExerciseService.startExerciseFromUnlockedFreePractice(
          this.authService.userId,
          eduContent.id,
          ufp.id
        );
      });
  }

  public openEduContentAsSolution(eduContent: EduContent): void {
    // students can't open with solution
  }

  public openEduContentAsStream(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent, true);
  }

  public openEduContentAsDownload(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent, false);
  }

  public openBoeke(eduContent: EduContent): void {
    this.openStaticContentService.open(eduContent);
  }

  private setupSearchResults(): void {
    this.searchResults$ = this.searchState$.pipe(
      withLatestFrom(this.getInitialSearchState()),
      filter(([searchState, initialSearchState]) => searchState !== null),
      map(([searchState, initialSearchState]) => ({
        ...initialSearchState,
        ...searchState,
        filterCriteriaSelections: new Map([
          ...Array.from(searchState.filterCriteriaSelections.entries()),
          ...Array.from(initialSearchState.filterCriteriaSelections.entries())
        ])
      })),
      switchMap(searchState => this.eduContentService.search(searchState)),
      withLatestFrom(
        this.store.pipe(select(ResultQueries.getBestResultByEduContentId)),
        this.currentBook$,
        this.store.pipe(select(MethodLevelQueries.getAll))
      ),
      map(([searchResult, resultDict, currentBook, methodLevels]) => {
        return {
          ...searchResult,
          results: searchResult.results.map(
            (searchResultItem: EduContentInterface) => {
              const eduContent = Object.assign<EduContent, EduContentInterface>(
                new EduContent(),
                searchResultItem
              );

              const methodLevel = methodLevels.find(
                ml =>
                  ml.methodId === currentBook.methodId &&
                  ml.levelId === eduContent.levelId
              );

              return {
                eduContent,
                result: resultDict[eduContent.id],
                methodLevel
              };
            }
          )
        };
      })
    );
  }
}
