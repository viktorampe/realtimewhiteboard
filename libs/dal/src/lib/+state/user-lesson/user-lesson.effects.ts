import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { from } from 'rxjs';
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
  CreateUserLesson,
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
  createUserLesson$ = this.dataPersistence.pessimisticUpdate(
    UserLessonsActionTypes.CreateUserLesson,
    {
      run: (action: CreateUserLesson, state: DalState) => {
        return this.userLessonService
          .createForUser(action.payload.userId, action.payload.userLesson)
          .pipe(
            switchMap((userLesson: UserLessonInterface) => {
              const actions: (AddEffectFeedback | AddUserLesson)[] = [
                new AddUserLesson({ userLesson })
              ];
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
      onError: (action: CreateUserLesson, error) => {
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
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(USER_LESSON_SERVICE_TOKEN)
    private userLessonService: UserLessonServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
