import { Injectable } from '@angular/core';
import {
  ClassGroupInterface,
  ClassGroupQueries,
  DalState,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentTOCInterface,
  EduContentTocQueries,
  getRouterState,
  MethodQueries,
  RouterStateUrl
} from '@campus/dal';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { merge, Observable } from 'rxjs';
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

  //Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  private currentBook$: Observable<EduContentBookInterface>;

  constructor(private store: Store<DalState>) {
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
  }

  private setPresentationStreams() {
    this.bookTitle$ = this.getBookTitleStream();
    this.bookChapters$ = this.getBookChaptersStream();
    this.filteredClassGroups$ = this.getFilteredClassGroupsStream();
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
}
