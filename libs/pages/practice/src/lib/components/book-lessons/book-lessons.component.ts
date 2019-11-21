import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DalState,
  EduContentTOCInterface,
  getRouterState,
  RouterStateUrl
} from '@campus/dal';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
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
  public tocsForToc$: Observable<EduContentTOCInterface[]>;
  public currentBookLessonsParams$: Observable<CurrentBookLessonsParams>;

  // Source streams
  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    private viewModel: PracticeViewModel,
    private route: ActivatedRoute
  ) {
    this.initialize();
  }

  clickOpenToc(id: number) {
    alert(id);
  }

  private initialize() {
    this.setSourceStreams();
  }

  private setSourceStreams() {
    //TODO: this.tocsForToc$ = this.viewModel.chapterLessons$.pipe(

    this.tocsForToc$ = of([
      { title: 'Hoofdstuk 1', id: 1, treeId: 1, lft: 1, rgt: 8, depth: 0 },
      { title: 'Les 1', id: 2, treeId: 1, lft: 2, rgt: 7, depth: 1 },
      { title: 'Les 2', id: 3, treeId: 1, lft: 3, rgt: 6, depth: 1 },
      { title: 'Les 3', id: 4, treeId: 1, lft: 4, rgt: 5, depth: 1 }
    ]);

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
