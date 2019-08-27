import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentTocQueries,
  UserLessonInterface,
  UserLessonQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable()
export class LearningPlanGoalProgressManagementViewModel {
  public userLessons$: Observable<UserLessonInterface[]>;

  constructor(private store: Store<DalState>) {
    this.initialize();
    console.log('vm', 'constructed!');
  }

  private initialize() {
    this.setupStreams();
  }

  private setupStreams() {
    this.userLessons$ = this.store.pipe(select(UserLessonQueries.getAll));
  }

  public getMethodLessonsForBook(
    bookId: number,
    learningPlanGoalId: number
  ): Observable<{ eduContentTocId: number; values: string[] }[]> {
    const props = { bookId, learningPlanGoalId };

    return this.store.pipe(
      select(EduContentTocQueries.getLessonDisplaysForBook, props)
    );
  }
}
