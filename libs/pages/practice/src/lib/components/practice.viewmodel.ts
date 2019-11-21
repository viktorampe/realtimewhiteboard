import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupInterface,
  ClassGroupQueries,
  DalState,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentTOCInterface,
  EduContentTocQueries,
  getRouterState,
  MethodQueries,
  MethodYearsInterface,
  RouterStateUrl,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeInterface,
  UnlockedFreePracticeQueries
} from '@campus/dal';
import { Dictionary } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { merge, Observable, zip } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  shareReplay,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {
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
export class PracticeViewModel {
  //Presentation streams
  public currentPracticeParams$: Observable<CurrentPracticeParams>;
  public bookTitle$: Observable<string>;
  public bookChapters$: Observable<EduContentTOCInterface[]>;
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

  //Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  private currentBook$: Observable<EduContentBookInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.initialize();
  }

  private initialize() {
    this.setSourceStreams();
    this.setPresentationStreams();
  }

  private setSourceStreams() {
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
    this.chapterLessons$ = this.getChapterLessonStream();
    this.filteredClassGroups$ = this.getFilteredClassGroupsStream();
    this.methodYears$ = this.store.pipe(
      select(MethodQueries.getAllowedMethodYears)
    );
    this.unlockedBooks$ = this.store.pipe(select(getUnlockedBooks));
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

  private getChapterLessonStream(): Observable<EduContentTOCInterface[]> {
    const lessonsStreamWhenNoChapterId$ = this.currentPracticeParams$.pipe(
      tap(console.log),
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
}
