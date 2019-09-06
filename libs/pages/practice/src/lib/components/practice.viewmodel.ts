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
import {
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface
} from '@campus/ui';
import { Dictionary } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { combineLatest, merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  shareReplay,
  switchMap
} from 'rxjs/operators';
export interface CurrentPracticeParams {
  book?: number;
}
@Injectable({
  providedIn: 'root'
})
export class PracticeViewModel {
  //Presentation streams
  public currentPracticeParams$: Observable<CurrentPracticeParams>;
  public bookTitle$: Observable<string>;
  public bookChapters$: Observable<EduContentTOCInterface[]>;
  public filteredClassGroups$: Observable<ClassGroupInterface[]>;
  public methodYears$: Observable<MethodYearsInterface[]>;

  //Multi-check-box-table streams
  public unlockedFreePracticeTableRowHeaders: MultiCheckBoxTableRowHeaderColumnInterface<
    EduContentTOCInterface
  >[];
  public unlockedFreePracticeTableItemColumns$: Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  >;
  public unlockedFreePracticeTableItems$: Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  >;

  //Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  public currentBook$: Observable<EduContentBookInterface>;
  private unlockedFreePracticeByEduContentTOCId$: Observable<
    Dictionary<UnlockedFreePracticeInterface[]>
  >;

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
  }

  private setPresentationStreams() {
    this.bookTitle$ = this.getBookTitleStream();
    this.bookChapters$ = this.getBookChaptersStream();
    this.filteredClassGroups$ = this.getFilteredClassGroupsStream();
    this.methodYears$ = this.store.pipe(
      select(MethodQueries.getAllowedMethodYears)
    );

    //Multi-check-box-table streams
    this.unlockedFreePracticeTableRowHeaders = [
      { caption: 'Hoofdstuk', key: 'title' }
    ];
    this.unlockedFreePracticeTableItemColumns$ = this.getPracticeTableItemColumnsStream();
    this.unlockedFreePracticeTableItems$ = this.getPracticeTableItemsStream();
  }

  private getCurrentPracticeParamsStream(): Observable<CurrentPracticeParams> {
    return this.routerState$.pipe(
      filter(routerState => !!routerState),
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        book: +routerState.state.params.book || undefined
      })),
      distinctUntilChanged((a, b) => a.book === b.book),
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

  private getFilteredClassGroupsStream(): Observable<ClassGroupInterface[]> {
    return this.currentBook$.pipe(
      filter(currentBook => !!currentBook),
      switchMap(currentBook => {
        return this.store.pipe(
          select(ClassGroupQueries.getByMethodId, { id: currentBook.methodId })
        );
      })
    );
  }

  private getPracticeTableItemColumnsStream(): Observable<
    MultiCheckBoxTableItemColumnInterface<ClassGroupInterface>[]
  > {
    return this.filteredClassGroups$.pipe(
      map(classGroups =>
        classGroups.map(
          (
            classGroup
          ): MultiCheckBoxTableItemColumnInterface<ClassGroupInterface> => ({
            item: classGroup,
            key: 'id',
            label: 'name'
          })
        )
      )
    );
  }

  private getPracticeTableItemsStream(): Observable<
    MultiCheckBoxTableItemInterface<EduContentTOCInterface>[]
  > {
    return combineLatest([
      this.bookChapters$,
      this.unlockedFreePracticeByEduContentTOCId$,
      this.filteredClassGroups$
    ]).pipe(
      map(([chapterTOCs, unlockedPracticesByTOC, filteredClassGroups]) => {
        return this.createCheckboxItemsForUnlockedFreePractices(
          chapterTOCs,
          filteredClassGroups,
          unlockedPracticesByTOC
        );
      })
    );
  }

  private createCheckboxItemsForUnlockedFreePractices(
    eduContentTOCs: EduContentTOCInterface[],
    classGroups: ClassGroupInterface[],
    unlockedPracticesByTOC: Dictionary<UnlockedFreePracticeInterface[]>
  ): MultiCheckBoxTableItemInterface<EduContentTOCInterface>[] {
    return eduContentTOCs
      .map(eduContentTOC => {
        const unlockedPracticesByClassGroup: Dictionary<boolean> = {};
        classGroups.forEach(classGroup => {
          unlockedPracticesByClassGroup[classGroup.id] = (
            unlockedPracticesByTOC[eduContentTOC.id] || []
          ).some(
            unlockedPractice => unlockedPractice.classGroupId === classGroup.id
          );
        });

        return {
          header: eduContentTOC,
          content: unlockedPracticesByClassGroup
        };
      })
      .sort((a, b) => {
        return a.header.title.localeCompare(b.header.title, undefined, {
          numeric: true
        });
      });
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
      this.store.dispatch(
        new UnlockedFreePracticeActions.DeleteUnlockedFreePractices({
          ids: unlockedFreePractices.map(ufp => ufp.id)
        })
      );
    }
  }
}
