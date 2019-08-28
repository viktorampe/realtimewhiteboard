import { Injectable } from '@angular/core';
import {
  ClassGroupInterface,
  DalState,
  EduContentTocQueries,
  LearningPlanGoalInterface,
  UserLessonInterface,
  UserLessonQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface MethodLessonInterface {
  eduContentTocId: number;
  values: string[];
}

@Injectable({ providedIn: 'root' })
export class LearningPlanGoalProgressManagementViewModel {
  public userLessons$: Observable<UserLessonInterface[]>;

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

  public createLearningPlanGoalProgressForUserLesson(
    learningPlanGoal: LearningPlanGoalInterface,
    classGroup: ClassGroupInterface,
    userLesson: UserLessonInterface // could just be description -> create new
  ): void {
    console.log(
      'createLearningPlanGoalProgressForUserLesson',
      learningPlanGoal,
      classGroup,
      userLesson
    );
  }

  public createLearningPlanGoalProgressForEduContentTOCs(
    learningPlanGoal: LearningPlanGoalInterface,
    classGroup: ClassGroupInterface,
    eduContentTOCids: number[]
  ): void {
    console.log(
      'createLearningPlanGoalProgressForEduContentTOCs',
      learningPlanGoal,
      classGroup,
      eduContentTOCids
    );
  }
}
