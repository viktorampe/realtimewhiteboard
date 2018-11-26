import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { TaskEduContentServiceInterface, TASK_EDU_CONTENT_SERVICE_TOKEN } from '../../task-edu-content/task-edu-content.service.interface';
import {
  TaskEduContentsActionTypes,
  TaskEduContentsLoadError,
  LoadTaskEduContents,
  TaskEduContentsLoaded
} from './task-edu-content.actions';
import { DalState } from '..';

@Injectable()
export class TaskEduContentEffects {
  @Effect()
  loadTaskEduContents$ = this.dataPersistence.fetch(
    TaskEduContentsActionTypes.LoadTaskEduContents,
    {
      run: (action: LoadTaskEduContents, state: DalState) => {
        if (!action.payload.force && state.taskEduContents.loaded) return;
        return this.taskEduContentService
          .getAllForUser(action.payload.userId)
          .pipe(map(taskEduContents => new TaskEduContentsLoaded({ taskEduContents })));
      },
      onError: (action: LoadTaskEduContents, error) => {
        return new TaskEduContentsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_EDU_CONTENT_SERVICE_TOKEN)
    private taskEduContentService: TaskEduContentServiceInterface
  ) {}
}
