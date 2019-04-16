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
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import {
  AddTaskEduContent,
  LinkTaskEduContent,
  LinkTaskEduContentError,
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

  @Effect()
  linkTaskEduContent$ = this.dataPersistence.fetch<LinkTaskEduContent>(
    TaskEduContentsActionTypes.LinkTaskEduContent,
    {
      run: (action: LinkTaskEduContent, state: DalState) => {
        return this.taskService
          .linkEduContent(action.payload.taskId, action.payload.eduContentId)
          .pipe(
            map(taskEduContent => new AddTaskEduContent({ taskEduContent }))
          );
      },
      onError: (action: LinkTaskEduContent, error) => {
        return new LinkTaskEduContentError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_EDU_CONTENT_SERVICE_TOKEN)
    private taskEduContentService: TaskEduContentServiceInterface,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {}
}
