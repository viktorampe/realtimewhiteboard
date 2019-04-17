import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskEduContentServiceInterface,
  TASK_EDU_CONTENT_SERVICE_TOKEN
} from '../../tasks/task-edu-content.service.interface';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { EffectFeedback, Priority } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddTaskEduContent,
  LinkTaskEduContent,
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
  linkTaskEduContent$ = this.dataPersistence.pessimisticUpdate(
    TaskEduContentsActionTypes.LinkTaskEduContent,
    {
      run: (action: LinkTaskEduContent, state: DalState) => {
        return this.taskService
          .linkEduContent(action.payload.taskId, action.payload.eduContentId)
          .pipe(
            switchMap(taskEduContent => [
              new AddEffectFeedback({
                effectFeedback: new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: 'Het leermateriaal werd aan de taak toegevoegd.',
                  type: 'success',
                  display: true,
                  priority: Priority.NORM
                })
              }),
              new AddTaskEduContent({
                taskEduContent
              })
            ])
          );
      },
      onError: (action: LinkTaskEduContent, error) => {
        return new AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: this.uuid(),
            triggerAction: action,
            message:
              'Het is niet gelukt om het leermateriaal aan de taak toe te voegen.',
            userActions: [
              {
                title: 'Opnieuw proberen.',
                userAction: action
              }
            ],
            display: action.payload.displayResponse,
            type: 'error',
            priority: Priority.HIGH
          })
        });
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_EDU_CONTENT_SERVICE_TOKEN)
    private taskEduContentService: TaskEduContentServiceInterface,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
