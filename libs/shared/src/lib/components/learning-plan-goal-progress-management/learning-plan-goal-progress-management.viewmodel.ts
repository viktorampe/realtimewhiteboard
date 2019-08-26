import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentTocQueries,
  UserLessonInterface,
  UserLessonQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface MethodLessonInterface {
  eduContentTocId: number;
  values: string[];
}

@Injectable()
export class LearningPlanGoalProgressManagementViewModel {
  bookId: number;
  learningPlanGoalId: number;

  userLessons$: Observable<UserLessonInterface[]>;
  methodLessonsForBook$: Observable<MethodLessonInterface[]>;

  constructor(private store: Store<DalState>) {
    this.initialize();
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
  ): Observable<MethodLessonInterface[]> {
    const props = { bookId, learningPlanGoalId };

    return this.store.pipe(
      select(EduContentTocQueries.getLessonDisplaysForBook, props)
    );
  }
}
