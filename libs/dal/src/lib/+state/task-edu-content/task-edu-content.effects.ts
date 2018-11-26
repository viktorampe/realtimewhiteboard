import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskEduContentServiceInterface,
  TASK_EDU_CONTENT_SERVICE_TOKEN
} from '../../tasks/task-edu-content.service.interface';
import {
  LoadTaskEduContents,
  TaskEduContentsActionTypes,
  TaskEduContentsLoaded,
  TaskEduContentsLoadError
} from './task-edu-content.actions';

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
          .pipe(
            map(
              taskEduContents => new TaskEduContentsLoaded({ taskEduContents })
            )
          );
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
