import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  DalState,
  EduContentTOCInterface,
  getRouterState,
  RouterStateUrl
} from '@campus/dal';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { PracticeViewModel } from '../practice.viewmodel';

export interface CurrentBookLessonsParams {
  book?: number;
  chapter?: number;
  lesson?: number;
}

@Component({
  selector: 'campus-book-lessons',
  templateUrl: './book-lessons.component.html',
  styleUrls: ['./book-lessons.component.scss']
})
export class BookLessonsComponent {
  public currentChapter$: Observable<EduContentTOCInterface>;
  public tocsForToc$: Observable<EduContentTOCInterface[]>;
  public currentBookLessonsParams$: Observable<CurrentBookLessonsParams>;

  // Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    private viewModel: PracticeViewModel,
    private router: Router
  ) {
    this.initialize();
  }

  clickOpenToc(bookId: number, chapterId: number, lessonId?: number) {
    const dynamicParams = [bookId, chapterId, lessonId].filter(Number);
    this.router.navigate(['/practice', ...dynamicParams]);
  }
  clickToBookChapter(bookId: number) {
    this.router.navigate(['/practice', bookId]);
  }

  private initialize() {
    this.setSourceStreams();
  }

  private setSourceStreams() {
    this.currentChapter$ = this.viewModel.currentChapter$;
    this.tocsForToc$ = this.viewModel.chapterLessons$;
    this.routerState$ = this.store.pipe(select(getRouterState));
    this.currentBookLessonsParams$ = this.getCurrentBookLessonsParams();
  }

  private getCurrentBookLessonsParams(): Observable<CurrentBookLessonsParams> {
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
}
