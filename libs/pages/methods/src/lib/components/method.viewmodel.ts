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
import { merge, Observable } from 'rxjs';
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
  }

  setSourceStreams() {
    this.routerState$ = this.store.pipe(select(getRouterState));

    this.currentMethodParams$ = this.getCurrentMethodParams();
    this.currentBook$ = this.getCurrentBookStream();
    this.currentMethod$ = this.getCurrentMethodStream();
    this.currentToc$ = this.getTocsStream();

    this.generalFiles$ = this.getGeneralFilesStream();
  }

  getCurrentMethodParams() {
    return this.routerState$.pipe(
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        book: +routerState.state.params.book,
        chapter: +routerState.state.params.chapter,
        lesson: +routerState.state.params.lesson
      }))
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

  getCurrentMethodStream() {
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

  getTocsStream() {
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

  getGeneralFilesStream() {
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
}
