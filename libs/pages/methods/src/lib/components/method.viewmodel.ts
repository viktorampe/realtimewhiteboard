import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentBookInterface,
  EduContentBookQueries,
  EduContentInterface,
  EduContentServiceInterface,
  EduContentTOCInterface,
  EduContentTocQueries,
  EDU_CONTENT_SERVICE_TOKEN,
  getRouterState,
  MethodInterface,
  RouterStateUrl
} from '@campus/dal';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, switchMap } from 'rxjs/operators';

interface CurrentMethodParams {
  book: number;
  chapter: number;
  lesson: number;
}

@Injectable({
  providedIn: 'root'
})
export class MethodViewModel {
  private currentMethodParams$: Observable<CurrentMethodParams>;
  private currentBook$: Observable<EduContentBookInterface>;
  private currentMethod$: Observable<MethodInterface>;
  private currentToc$: Observable<EduContentTOCInterface[]>;
  private generalFiles$: Observable<EduContentInterface[]>;
  private isDiaboloEnabled$: Observable<boolean>;
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(EDU_CONTENT_SERVICE_TOKEN)
    private eduContentService: EduContentServiceInterface
  ) {
    this.setSourceStreams();

    //X You have to get the routerstate to get the bookId, chapter and lesson Ids
    //X Switch logic depending on whether these are available or not (check if in Overview)
    //X From the bookId you get the book from the store
    //X From the book you get the method & years
    //X From the book you also get the toc for the book
    //X You also get the generalFiles from the educontent of this book
    //- (You may also need the types of these generalfiles)
    //You get the diaboloPhase of this book
    //You get the allowedMethods
  }

  setSourceStreams() {
    this.routerState$ = this.store.pipe(select(getRouterState));

    this.currentMethodParams$ = this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        book: +routerState.state.params.book,
        chapter: +routerState.state.params.chapter,
        lesson: +routerState.state.params.lesson
      }))
    );

    this.currentBook$ = this.currentMethodParams$.pipe(
      switchMap(currentMethodParams => {
        if (currentMethodParams.book) {
          return this.store.pipe(
            select(EduContentBookQueries.getById, {
              id: currentMethodParams.book
            })
          );
        }

        return of(null);
      })
    );

    this.currentMethod$ = this.currentBook$.pipe(
      map(book => {
        return book ? book.method : null;
      })
    );

    this.currentToc$ = this.getTocsStream();
    this.generalFiles$ = this.currentMethodParams$.pipe(
      switchMap(currentMethodParams => {
        if (currentMethodParams.book) {
          return this.eduContentService.getGeneralEduContentsForBookId(
            currentMethodParams.book
          );
        }

        return of([]);
      })
    );
  }

  getCurrentBookStream() {
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

  getTocsStream() {
    return this.currentMethodParams$.pipe(
      switchMap(currentMethodParams => {
        if (currentMethodParams.lesson || currentMethodParams.chapter) {
          return this.store.pipe(
            select(EduContentTocQueries.getTocsForToc, {
              tocId: currentMethodParams.lesson || currentMethodParams.chapter
            })
          );
        }

        if (currentMethodParams.book) {
          return this.store.pipe(
            select(EduContentTocQueries.getTocsForBook, {
              bookId: currentMethodParams.book
            })
          );
        }

        return of([]);
      })
    );
  }
}
