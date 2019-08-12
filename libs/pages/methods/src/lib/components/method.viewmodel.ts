import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupInterface,
  ClassGroupQueries,
  DalState,
  DiaboloPhaseInterface,
  DiaboloPhaseQueries,
  EduContent,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentInterface,
  EduContentProductTypeInterface,
  EduContentProductTypeQueries,
  EduContentQueries,
  EduContentServiceInterface,
  EduContentTOCInterface,
  EduContentTocQueries,
  EDU_CONTENT_SERVICE_TOKEN,
  getRouterState,
  LearningPlanGoalInterface,
  LearningPlanGoalProgressInterface,
  LearningPlanGoalProgressQueries,
  LearningPlanGoalQueries,
  MethodInterface,
  MethodQueries,
  MethodYearsInterface,
  RouterStateUrl,
  UserLessonInterface,
  UserLessonQueries
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
import {
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface
} from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, merge, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  switchMap,
  switchMapTo,
  withLatestFrom
} from 'rxjs/operators';

export interface CurrentMethodParams {
  book?: number;
  chapter?: number;
  lesson?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MethodViewModel implements ContentOpenerInterface {
  public searchResults$: Observable<SearchResultInterface>;
  public searchState$: Observable<SearchStateInterface>;

  public learningPlanGoalTableHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    LearningPlanGoalInterface
  >[];

  // Presentation streams
  public currentToc$: Observable<EduContentTOCInterface[]>;
  public currentMethod$: Observable<MethodInterface>;
  public currentBoeke$: Observable<EduContent>;
  public methodYears$: Observable<MethodYearsInterface[]>;
  public currentBook$: Observable<EduContentBookInterface>;
  public eduContentProductTypes$: Observable<EduContentProductTypeInterface[]>;
  public generalFilesByType$: Observable<Dictionary<EduContent[]>>;
  public currentTab$: Observable<number>;
  public currentMethodParams$: Observable<CurrentMethodParams>;
  public classGroups$: Observable<ClassGroupInterface[]>;
  public filteredClassGroups$: Observable<ClassGroupInterface[]>;
  public userLessons$: Observable<UserLessonInterface[]>;
  public learningPlanGoalsWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableItemInterface<LearningPlanGoalProgressInterface>[]
  >;
  public learningPlanGoalsPerLessonWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableSubLevelInterface<
      EduContentTOCInterface,
      LearningPlanGoalProgressInterface
    >[]
  >;

  // Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  private generalFiles$: Observable<EduContent[]>;
  private diaboloPhases$: Observable<DiaboloPhaseInterface[]>;
  private learningPlanGoalsForCurrentBook$: Observable<
    LearningPlanGoalInterface[]
  >;
  private learningPlanGoalProgressBylearningPlanGoalId$: Observable<
    Dictionary<LearningPlanGoalProgressInterface[]>
  >;
  private currentLessons$: Observable<EduContentTOCInterface[]>;

  private _searchState$: BehaviorSubject<SearchStateInterface>;

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
   * determine the searchMode for a given string
   */
  public getSearchMode(mode: string): Observable<SearchModeInterface> {
    return this.currentBook$.pipe(
      map(currentBook => {
        if (currentBook && currentBook.diabolo && mode === 'chapter-lesson') {
          return this.searchModes['diabolo-chapter-lesson'];
        } else {
          return this.searchModes[mode];
        }
      })
    );
  }

  /*
   * determine the initial searchState from the router state store
   */
  public getInitialSearchState(): Observable<SearchStateInterface> {
    return this.currentTab$.pipe(
      switchMapTo(
        this.currentMethodParams$.pipe(
          withLatestFrom(this.currentBook$, this.currentMethod$),
          map(([currentMethodParams, currentBook, currentMethod]) => {
            const initialSearchState: SearchStateInterface = {
              searchTerm: '',
              filterCriteriaSelections: new Map<string, (number | string)[]>()
            };

            if (currentBook) {
              initialSearchState.filterCriteriaSelections.set(
                'years',
                currentBook.years.map(year => year.id)
              );

              initialSearchState.filterCriteriaSelections.set('methods', [
                currentBook.methodId
              ]);
            }

            if (currentMethod) {
              initialSearchState.filterCriteriaSelections.set('learningArea', [
                currentMethod.learningAreaId
              ]);
            }

            if (currentMethodParams && currentMethodParams.chapter) {
              initialSearchState.filterCriteriaSelections.set('eduContentTOC', [
                currentMethodParams.lesson
                  ? currentMethodParams.lesson
                  : currentMethodParams.chapter
              ]);
            }

            return initialSearchState;
          })
        )
      )
    );
  }

  public requestAutoComplete(searchTerm: string): Observable<string[]> {
    return this.getInitialSearchState().pipe(
      map(initialSearchState => {
        return { ...initialSearchState, searchTerm };
      }),
      switchMap(enrichedSearchState => {
        return this.eduContentService.autoComplete(enrichedSearchState);
      })
    );
  }

  /*
   * let the page component pass through the updated state from the search component
   */
  public updateState(state: SearchStateInterface) {
    this._searchState$.next(state);
  }

  public openEduContentAsExercise(eduContent: EduContent): void {
    this.scormExerciseService.previewExerciseFromUnlockedContent(
      null,
      eduContent.id,
      null,
      false
    );
  }

  public openEduContentAsSolution(eduContent: EduContent): void {
    this.scormExerciseService.previewExerciseFromUnlockedContent(
      null,
      eduContent.id,
      null,
      true
    );
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

  private initialize() {
    this.learningPlanGoalTableHeaders = [
      { caption: 'Prefix', key: 'prefix' },
      { caption: 'Doel', key: 'goal' }
    ];

    this.setSourceStreams();
    this.setPresentationStreams();
    this.setupSearchResults();
  }

  private setPresentationStreams(): void {
    this.currentBoeke$ = this.getCurrentBoekeStream();
    this.methodYears$ = this.store.pipe(
      select(MethodQueries.getAllowedMethodYears)
    );
    this.currentToc$ = this.getTocsStream();
    this.eduContentProductTypes$ = this.getEduContentProductTypesStream();
    this.generalFilesByType$ = this.getGeneralFilesByType();
    this.currentTab$ = this.getCurrentTab();
    this.filteredClassGroups$ = this.getFilteredClassGroups();
    this.currentLessons$ = this.getTocLessonsStream();
    this.userLessons$ = this.store.pipe(select(UserLessonQueries.getAll));
    this.learningPlanGoalsWithSelectionForClassGroups$ = this.getLearningPlanGoalsWithSelectionStream();
    this.learningPlanGoalsPerLessonWithSelectionForClassGroups$ = this.getLearningPlanGoalsPerLessonWithSelectionStream();
  }

  private getCurrentTab(): Observable<number> {
    return this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => {
        return (
          (routerState.state.queryParams &&
            +routerState.state.queryParams.tab) ||
          0
        );
      })
    );
  }

  private getCurrentBoekeStream(): Observable<EduContent> {
    return this.currentMethodParams$.pipe(
      switchMap(currentMethodParams =>
        this.store.pipe(
          select(EduContentQueries.getBoekeByBookId, {
            bookId: currentMethodParams.book
          })
        )
      )
    );
  }

  private setupSearchResults(): void {
    this.searchResults$ = this.searchState$.pipe(
      withLatestFrom(this.getInitialSearchState(), this.currentTab$),
      filter(
        ([searchState, initialSearchState, currentTab]) =>
          searchState !== null && currentTab === 0
      ),
      map(([searchState, initialSearchState]) => ({
        ...initialSearchState,
        ...searchState,
        filterCriteriaSelections: new Map([
          ...Array.from(searchState.filterCriteriaSelections.entries()),
          ...Array.from(initialSearchState.filterCriteriaSelections.entries())
        ])
      })),
      switchMap(searchState => this.eduContentService.search(searchState)),
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

  private setSourceStreams() {
    this._searchState$ = new BehaviorSubject<SearchStateInterface>(null);
    this.searchState$ = this._searchState$;

    this.routerState$ = this.store.pipe(select(getRouterState));

    this.currentMethodParams$ = this.getCurrentMethodParams();

    this.currentBook$ = this.getCurrentBookStream();
    this.currentMethod$ = this.getCurrentMethodStream();

    this.generalFiles$ = this.getGeneralFilesStream();
    this.diaboloPhases$ = this.getDiaboloPhasesStream();

    this.learningPlanGoalsForCurrentBook$ = this.getLearningPlanGoalsForCurrentBookStream();
    this.classGroups$ = this.store.pipe(select(ClassGroupQueries.getAll));
    this.learningPlanGoalProgressBylearningPlanGoalId$ = this.store.pipe(
      select(LearningPlanGoalProgressQueries.getGroupedByLearningPlanGoalId)
    );
  }

  private getCurrentMethodParams(): Observable<CurrentMethodParams> {
    return this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        book: +routerState.state.params.book || undefined,
        chapter: +routerState.state.params.chapter || undefined,
        lesson: +routerState.state.params.lesson || undefined
      })),
      distinctUntilChanged(
        (a, b) =>
          a.book === b.book && a.chapter === b.chapter && a.lesson === b.lesson
      )
    );
  }

  private getCurrentBookStream(): Observable<EduContentBookInterface> {
    const currentBookWhenEmpty$ = this.currentMethodParams$.pipe(
      filter(params => !params.book),
      mapTo(null)
    );

    const currentBookWhenExists$ = this.currentMethodParams$.pipe(
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

  private getCurrentMethodStream(): Observable<MethodInterface> {
    const currentMethodWhenBook$ = this.currentBook$.pipe(
      filter(book => !!book),
      switchMap(book => {
        return this.store.pipe(
          select(MethodQueries.getById, { id: book.methodId })
        );
      })
    );

    const currentMethodWhenNoBook$ = this.currentBook$.pipe(
      filter(book => !book),
      mapTo(null)
    );

    return merge(currentMethodWhenBook$, currentMethodWhenNoBook$);
  }

  private getTocsStream(): Observable<EduContentTOCInterface[]> {
    const tocStreamWhenLessonChapter$ = this.currentMethodParams$.pipe(
      filter(params => !!params.chapter),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getTocsForToc, {
            tocId: params.chapter
          })
        );
      })
    );

    const tocStreamWhenBook$ = this.currentMethodParams$.pipe(
      filter(params => !!params.book && !params.chapter),
      switchMap(params => {
        return this.store.pipe(
          select(EduContentTocQueries.getChaptersForBook, {
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

  private getTocLessonsStream(): Observable<EduContentTOCInterface[]> {
    return this.currentMethodParams$.pipe(
      filter(params => !!params.chapter),
      switchMap(params => {
        if (params.lesson) {
          return this.store.pipe(
            select(EduContentTocQueries.getById, { id: +params.lesson }),
            map(toc => [toc])
          );
        }
        return this.currentToc$;
      })
    );
  }

  private getFilteredClassGroups(): Observable<ClassGroupInterface[]> {
    // TODO: filter classgroups by year and method (through license relations) from the current book
    // TODO: filter classgroups through select dropdown
    return this.store.pipe(select(ClassGroupQueries.getAll));
  }

  private getGeneralFilesStream(): Observable<EduContent[]> {
    const generalFilesWhenBook$ = this.currentMethodParams$.pipe(
      filter(params => !!params.book),
      switchMap(params => {
        return this.eduContentService.getGeneralEduContentForBookId(
          params.book
        );
      }),
      map(eduContents => {
        return eduContents.map(eduContent => {
          return Object.assign<EduContent, EduContentInterface>(
            new EduContent(),
            eduContent
          );
        });
      })
    );

    const generalFilesWhenNoBook$ = this.currentMethodParams$.pipe(
      filter(params => !params.book),
      mapTo([])
    );

    return merge(generalFilesWhenBook$, generalFilesWhenNoBook$);
  }

  private getEduContentProductTypesStream(): Observable<
    EduContentProductTypeInterface[]
  > {
    return this.store.pipe(select(EduContentProductTypeQueries.getAll));
  }

  private getDiaboloPhasesStream(): Observable<DiaboloPhaseInterface[]> {
    return this.store.pipe(select(DiaboloPhaseQueries.getAll));
  }

  private getGeneralFilesByType(): Observable<Dictionary<EduContent[]>> {
    return this.generalFiles$.pipe(
      map(eduContents => {
        return eduContents.reduce(
          (acc, eduContent) => {
            const productType =
              eduContent.publishedEduContentMetadata.eduContentProductTypeId;
            if (!acc[productType]) {
              acc[productType] = [];
            }
            acc[productType].push(eduContent);

            return acc;
          },
          {} as Dictionary<EduContent[]>
        );
      })
    );
  }

  private getLearningPlanGoalsForCurrentBookStream(): Observable<
    LearningPlanGoalInterface[]
  > {
    return this.currentBook$.pipe(
      filter(book => !!book),
      switchMap(book => {
        return this.store.pipe(
          select(LearningPlanGoalQueries.getByBookId, { bookId: book.id })
        );
      })
    );
  }

  private getLearningPlanGoalsWithSelectionStream(): Observable<
    MultiCheckBoxTableItemInterface<LearningPlanGoalProgressInterface>[]
  > {
    return combineLatest([
      this.learningPlanGoalsForCurrentBook$,
      this.learningPlanGoalProgressBylearningPlanGoalId$,
      this.classGroups$
    ]).pipe(
      map(([learningPlanGoals, progressByGoal, classGroups]) => {
        return learningPlanGoals.map(learningPlanGoal => {
          const progress = {};
          classGroups.forEach(classGroup => {
            progress[classGroup.id] = !!progressByGoal[learningPlanGoal.id];
          });

          return {
            header: learningPlanGoal,
            content: progress
          };
        });
      })
    );
  }

  private getLearningPlanGoalsPerLessonWithSelectionStream(): Observable<
    MultiCheckBoxTableSubLevelInterface<
      EduContentTOCInterface,
      LearningPlanGoalProgressInterface
    >[]
  > {
    return of([]);
  }
}
