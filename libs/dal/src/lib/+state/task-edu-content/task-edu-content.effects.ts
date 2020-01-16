import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
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
  DeleteTaskEduContent,
  LinkTaskEduContent,
  LoadTaskEduContents,
  StartUpdateTaskEduContents,
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
                  message: 'Het lesmateriaal werd aan de taak toegevoegd.',
                  type: 'success',
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
              'Het is niet gelukt om het lesmateriaal aan de taak toe te voegen.',
            userActions: [
              {
                title: 'Opnieuw proberen.',
                userAction: action
              }
            ],
            type: 'error',
            priority: Priority.HIGH
          })
        });
      }
    }
  );

  @Effect()
  deleteTaskEduContent$ = this.dataPersistence.optimisticUpdate(
    TaskEduContentsActionTypes.DeleteTaskEduContent,
    {
      run: (action: DeleteTaskEduContent, state: DalState) => {
        return this.taskEduContentService.remove(action.payload.id).pipe(
          mapTo(
            new AddEffectFeedback({
              effectFeedback: new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Het lesmateriaal is uit de taak verwijderd.'
              })
            })
          )
        );
      },
      undoAction: (action: DeleteTaskEduContent, error: any) => {
        // Something went wrong: could be a 401 or 404 ...
        const undoAction = undo(action);

        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message:
            'Het is niet gelukt om het lesmateriaal uit de taak te verwijderen.',
          userActions: [{ title: 'Opnieuw', userAction: action }],
          type: 'error',
          priority: Priority.HIGH
        });

        const feedbackAction = new AddEffectFeedback({
          effectFeedback
        });

        // undo the failed action and trigger feedback for user
        return from<Action[]>([undoAction, feedbackAction]);
      }
    }
  );

  startUpdateTaskEduContents$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(
      TaskEduContentsActionTypes.StartUpdateTaskEduContents,
      {
        run: (action: StartUpdateTaskEduContents, state: DalState) => {
          throw new Error('not implemented yet');
        },
        onError: (action: StartUpdateTaskEduContents, error: any) => {
          throw new Error('not implemented yet');
        }
      }
    )
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
