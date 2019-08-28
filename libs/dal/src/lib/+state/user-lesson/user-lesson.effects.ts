import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { from, merge } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import { UserLessonInterface } from '../../+models';
import {
  UserLessonServiceInterface,
  USER_LESSON_SERVICE_TOKEN
} from '../../user-lesson/user-lesson.service.interface';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddUserLesson,
  AddUserLessonWithLearningPlanGoalProgresses,
  CreateUserLesson,
  CreateUserLessonWithLearningPlanGoalProgresses,
  LoadUserLessons,
  UserLessonsActionTypes,
  UserLessonsLoaded,
  UserLessonsLoadError
} from './user-lesson.actions';

@Injectable()
export class UserLessonEffects {
  @Effect()
  loadUserLessons$ = this.dataPersistence.fetch(
    UserLessonsActionTypes.LoadUserLessons,
    {
      run: (action: LoadUserLessons, state: DalState) => {
        if (!action.payload.force && state.userLessons.loaded) return;
        return this.userLessonService
          .getAllForUser(action.payload.userId)
          .pipe(map(userLessons => new UserLessonsLoaded({ userLessons })));
      },
      onError: (action: LoadUserLessons, error) => {
        return new UserLessonsLoadError(error);
      }
    }
  );

  @Effect()
  createUserLesson$ = merge(
    this.dataPersistence.pessimisticUpdate(
      UserLessonsActionTypes.CreateUserLesson,
      this.getCreateUserLessonOpts()
    ),
    this.dataPersistence.pessimisticUpdate(
      UserLessonsActionTypes.CreateUserLessonWithLearningPlanGoalProgresses,
      this.getCreateUserLessonOpts()
    )
  );

  private getCreateUserLessonOpts() {
    return {
      run: (
        action:
          | CreateUserLesson
          | CreateUserLessonWithLearningPlanGoalProgresses,
        state: DalState
      ) => {
        return this.userLessonService
          .createForUser(action.payload.userId, action.payload.userLesson)
          .pipe(
            switchMap((userLesson: UserLessonInterface) => {
              let actions: (
                | AddEffectFeedback
                | AddUserLesson
                | AddUserLessonWithLearningPlanGoalProgresses)[];

              if (action instanceof CreateUserLesson) {
                actions = [new AddUserLesson({ userLesson })];
              } else if (
                action instanceof CreateUserLessonWithLearningPlanGoalProgresses
              ) {
                actions = [
                  new AddUserLessonWithLearningPlanGoalProgresses({
                    userId: action.payload.userId,
                    userLesson,
                    learningPlanGoalProgresses: action.payload.learningPlanGoalProgresses.map(
                      learningPlanGoalprogress => ({
                        ...learningPlanGoalprogress,
                        userLessonId: userLesson.id
                      })
                    )
                  })
                ];
              }

              const effectFeedback = EffectFeedback.generateSuccessFeedback(
                this.uuid(),
                action,
                `Les "${action.payload.userLesson.description}" toegevoegd.`
              );
              actions.push(new AddEffectFeedback({ effectFeedback }));
              return from(actions);
            })
          );
      },
      onError: (
        action:
          | CreateUserLesson
          | CreateUserLessonWithLearningPlanGoalProgresses,
        error
      ) => {
        return new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            this.uuid(),
            action,
            `Het is niet gelukt om les "${
              action.payload.userLesson.description
            }" toe te voegen.`
          )
        });
      }
    };
  }

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(USER_LESSON_SERVICE_TOKEN)
    private userLessonService: UserLessonServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
