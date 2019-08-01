import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { UserLessonServiceInterface, USER_LESSON_SERVICE_TOKEN } from '../../user-lesson/user-lesson.service.interface';
import {
  UserLessonsActionTypes,
  UserLessonsLoadError,
  LoadUserLessons,
  UserLessonsLoaded
} from './user-lesson.actions';
import { DalState } from '..';

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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(USER_LESSON_SERVICE_TOKEN)
    private userLessonService: UserLessonServiceInterface
  ) {}
}
