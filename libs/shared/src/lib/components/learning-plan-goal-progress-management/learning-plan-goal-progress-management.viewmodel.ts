import { Injectable } from '@angular/core';
import {
  DalState,
  EduContentTocQueries,
  LearningPlanGoalProgressActions,
  UserLessonActions,
  UserLessonInterface,
  UserLessonQueries,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
    learningPlanGoalId: number,
    classGroupId: number,
    description: string,
    eduContentBookId: number
  ): void {
    combineLatest([
      this.store.pipe(select(UserLessonQueries.getAll)),
      this.store.pipe(select(UserQueries.getCurrentUser))
    ])
      .pipe(take(1))
      .subscribe(([userLessons, user]) => {
        const foundUserLesson = userLessons.find(
          userLesson => userLesson.description === description
        );

        console.log(
          'log: LearningPlanGoalProgressManagementViewModel -> userLessons',
          userLessons
        );
        if (foundUserLesson) {
          this.store.dispatch(
            new LearningPlanGoalProgressActions.StartAddManyLearningPlanGoalProgresses(
              {
                personId: user.id, // TODO will need to refactor to userId
                learningPlanGoalProgresses: [
                  {
                    classGroupId,
                    learningPlanGoalId,
                    userLessonId: foundUserLesson.id,
                    eduContentBookId
                  }
                ]
              }
            )
          );
        } else {
          this.store.dispatch(
            new UserLessonActions.CreateUserLessonWithLearningPlanGoalProgresses(
              {
                userId: user.id,
                userLesson: { description },
                learningPlanGoalProgresses: [
                  {
                    classGroupId,
                    learningPlanGoalId,
                    eduContentBookId
                  }
                ]
              }
            )
          );
        }
      });
  }

  public createLearningPlanGoalProgressForEduContentTOCs(
    learningPlanGoalId: number,
    classGroupId: number,
    eduContentTOCids: number[],
    eduContentBookId: number
  ): void {
    this.store
      .pipe(
        select(UserQueries.getCurrentUser),
        take(1)
      )
      .subscribe(user => {
        this.store.dispatch(
          new LearningPlanGoalProgressActions.StartAddManyLearningPlanGoalProgresses(
            {
              personId: user.id, // TODO will need to refactor to userId
              learningPlanGoalProgresses: eduContentTOCids.map(
                eduContentTocId => ({
                  classGroupId,
                  learningPlanGoalId,
                  eduContentTocId,
                  eduContentBookId
                })
              )
            }
          )
        );
      });
  }
}
