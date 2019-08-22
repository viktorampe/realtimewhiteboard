import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WINDOW } from '@campus/browser';
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
  LearningPlanGoalProgressActions,
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
  EnvironmentApiInterface,
  EnvironmentSearchModesInterface,
  ENVIRONMENT_API_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  LearningPlanGoalProgressManagementComponent,
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
import { BehaviorSubject, combineLatest, merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  shareReplay,
  switchMap,
  switchMapTo,
  take,
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
  public classGroupsForMethod$: Observable<ClassGroupInterface[]>;
  public filteredClassGroups$: Observable<ClassGroupInterface[]>;
  public userLessons$: Observable<UserLessonInterface[]>;
  public breadCrumbTitles$: Observable<string>;
  public learningPlanGoalsWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableItemInterface<LearningPlanGoalInterface>[]
  >;
  public learningPlanGoalsPerLessonWithSelectionForClassGroups$: Observable<
    MultiCheckBoxTableSubLevelInterface<
      EduContentTOCInterface,
      LearningPlanGoalInterface
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
  private methodWithYear$: Observable<string>;
  private currentChapterTitle$: Observable<string>;
  private currentLessonTitle$: Observable<string>;

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
    private scormExerciseService: ScormExerciseServiceInterface,
    @Inject(ENVIRONMENT_API_TOKEN)
    private environmentApi: EnvironmentApiInterface,
    @Inject(WINDOW)
    private window: Window,
    private dialog: MatDialog
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

  public onLearningPlanGoalProgressChanged(
    classGroupId: number,
    learningPlanGoalId: number,
    eduContentTOCId: number,
    userLessonId: number,
    eduContentBookId: number
  ): void {
    this.store.dispatch(
      new LearningPlanGoalProgressActions.ToggleLearningPlanGoalProgress({
        classGroupId,
        learningPlanGoalId,
        eduContentTOCId,
        eduContentBookId,
        userLessonId,
        personId: this.authService.userId
      })
    );
  }

  public onBulkLearningPlanGoalProgressChanged(
    classGroupId: number,
    learningPlanGoalIds: number[],
    eduContentTOCId: number,
    eduContentBookId: number
  ): void {
    this.store.dispatch(
      new LearningPlanGoalProgressActions.BulkAddLearningPlanGoalProgresses({
        classGroupId,
        eduContentTOCId,
        learningPlanGoalIds,
        eduContentBookId,
        personId: this.authService.userId
      })
    );
  }

  public exportLearningPlanGoalProgress() {
    this.currentMethodParams$.pipe(take(1)).subscribe(currentMethodParams => {
      this.window.location.href = `${this.environmentApi.APIBase}/api/People/${
        this.authService.userId
      }/downloadLearningPlanGoalProgressByBookId/${currentMethodParams.book}`;
    });
  }

  openLearningPlanGoalProgressManagementDialog(): void {
    this.dialog.open(LearningPlanGoalProgressManagementComponent, {
      height: '400px',
      width: '600px',
      data: {}
    });
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
    this.breadCrumbTitles$ = this.getBreadCrumbTitlesStream();

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

    this.methodWithYear$ = this.getMethodWithYearStream();
    this.currentChapterTitle$ = this.getCurrentChapterTitleStream();
    this.currentLessonTitle$ = this.getCurrentLessonTitleStream();

    this.learningPlanGoalsForCurrentBook$ = this.getLearningPlanGoalsForCurrentBookStream();
    this.classGroups$ = this.store.pipe(select(ClassGroupQueries.getAll));
    this.learningPlanGoalProgressBylearningPlanGoalId$ = this.store.pipe(
      select(LearningPlanGoalProgressQueries.getGroupedByLearningPlanGoalId)
    );
  }

  private getCurrentMethodParams(): Observable<CurrentMethodParams> {
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
            select(EduContentTocQueries.getById, { id: params.lesson }),
            map(toc => [toc])
          );
        }
        return this.currentToc$;
      })
    );
  }

  private getBreadCrumbTitlesStream(): Observable<string> {
    return combineLatest([
      this.methodWithYear$,
      this.currentChapterTitle$,
      this.currentLessonTitle$
    ]).pipe(
      map(titles => {
        return titles.filter(title => title).join(' > ');
      })
    );
  }

  private getFilteredClassGroups(): Observable<ClassGroupInterface[]> {
    return this.currentMethod$.pipe(
      filter(currentMethod => !!currentMethod),
      map(currentMethod => currentMethod.id),
      switchMap(currentMethodId =>
        this.store.pipe(
          select(ClassGroupQueries.getByMethodId, { id: currentMethodId })
        )
      )
    );
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
    return this.store.pipe(
      select(EduContentProductTypeQueries.getAllOrderedBySequence)
    );
  }

  private getDiaboloPhasesStream(): Observable<DiaboloPhaseInterface[]> {
    return this.store.pipe(select(DiaboloPhaseQueries.getAll));
  }

  private getMethodWithYearStream(): Observable<string> {
    const methodYearWhenBook = this.currentMethodParams$.pipe(
      filter(currentMethodParams => !!currentMethodParams.book),
      switchMap(currentMethodParams => {
        return this.store.pipe(
          select(MethodQueries.getMethodWithYearByBookId, {
            id: currentMethodParams.book
          })
        );
      })
    );

    const methodYearWhenNoBook = this.currentMethodParams$.pipe(
      filter(currentMethodParams => !currentMethodParams.book),
      mapTo(null)
    );

    return merge(methodYearWhenBook, methodYearWhenNoBook).pipe(
      distinctUntilChanged()
    );
  }

  private getCurrentChapterTitleStream(): Observable<string> {
    const chapterTitleWhenChapter = this.currentMethodParams$.pipe(
      filter(currentMethodParams => !!currentMethodParams.chapter),
      switchMap(currentMethodParams => {
        return this.store.pipe(
          select(EduContentTocQueries.getById, {
            id: currentMethodParams.chapter
          })
        );
      }),
      map(toc => toc.title)
    );

    const chapterTitleWhenNoChapter = this.currentMethodParams$.pipe(
      filter(currentMethodParams => !currentMethodParams.chapter),
      mapTo(null)
    );

    return merge(chapterTitleWhenChapter, chapterTitleWhenNoChapter).pipe(
      distinctUntilChanged()
    );
  }

  private getCurrentLessonTitleStream(): Observable<string> {
    const lessonTitleWhenLesson = this.currentMethodParams$.pipe(
      filter(currentMethodParams => !!currentMethodParams.lesson),
      switchMap(currentMethodParams => {
        return this.store.pipe(
          select(EduContentTocQueries.getById, {
            id: currentMethodParams.lesson
          })
        );
      }),
      map(toc => toc.title)
    );

    const lessonTitleWhenNoLesson = this.currentMethodParams$.pipe(
      filter(currentMethodParams => !currentMethodParams.lesson),
      mapTo(null)
    );

    return merge(lessonTitleWhenLesson, lessonTitleWhenNoLesson).pipe(
      distinctUntilChanged()
    );
  }

  private getGeneralFilesByType(): Observable<Dictionary<EduContent[]>> {
    return this.generalFiles$.pipe(
      map(eduContents => {
        return eduContents.reduce(
          (acc, eduContent) => {
            const productType: number =
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
    MultiCheckBoxTableItemInterface<LearningPlanGoalInterface>[]
  > {
    return combineLatest([
      this.learningPlanGoalsForCurrentBook$,
      this.learningPlanGoalProgressBylearningPlanGoalId$,
      this.classGroups$
    ]).pipe(
      map(([learningPlanGoals, progressByGoal, classGroups]) => {
        return this.createCheckboxItemsForLearningPlanGoals(
          learningPlanGoals,
          classGroups,
          progressByGoal
        );
      })
    );
  }

  private getLearningPlanGoalsPerLessonWithSelectionStream(): Observable<
    MultiCheckBoxTableSubLevelInterface<
      EduContentTOCInterface,
      LearningPlanGoalInterface
    >[]
  > {
    return combineLatest([
      this.store.select(LearningPlanGoalQueries.getAllEntities),
      this.learningPlanGoalProgressBylearningPlanGoalId$,
      this.classGroups$,
      this.currentLessons$
    ]).pipe(
      map(([learningPlanGoalsMap, progressByGoal, classGroups, lessons]) => {
        return lessons.map(
          (
            lesson
          ): MultiCheckBoxTableSubLevelInterface<
            EduContentTOCInterface,
            LearningPlanGoalInterface
          > => {
            const learningPlanGoals: LearningPlanGoalInterface[] = lesson.learningPlanGoalIds.map(
              lpgId => learningPlanGoalsMap[lpgId]
            );
            return {
              item: lesson,
              label: 'title',
              children: this.createCheckboxItemsForLearningPlanGoals(
                learningPlanGoals,
                classGroups,
                progressByGoal
              )
            };
          }
        );
      })
    );
  }

  private createCheckboxItemsForLearningPlanGoals(
    learningPlanGoals: LearningPlanGoalInterface[],
    classGroups: ClassGroupInterface[],
    progressByGoal: Dictionary<LearningPlanGoalProgressInterface[]>
  ): MultiCheckBoxTableItemInterface<LearningPlanGoalInterface>[] {
    return learningPlanGoals
      .map(learningPlanGoal => {
        const progress: Dictionary<boolean> = {};
        classGroups.forEach(classGroup => {
          progress[classGroup.id] = (
            progressByGoal[learningPlanGoal.id] || []
          ).some(lpgp => lpgp.classGroupId === classGroup.id);
        });

        return {
          header: learningPlanGoal,
          content: progress
        };
      })
      .sort((a, b) => {
        return a.header.prefix.localeCompare(b.header.prefix, undefined, {
          numeric: true
        });
      });
  }
}
