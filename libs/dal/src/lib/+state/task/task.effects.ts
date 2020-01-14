import { Inject, Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import { TaskInterface } from '../../+models';
import { TASK_SERVICE_TOKEN } from '../../tasks/task.service.interface';
import { UNDO_SERVICE_TOKEN } from '../../undo/undo.service.interface';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  LoadTasks,
  StartUpdateTasks,
  TasksActionTypes,
  TasksLoaded,
  TasksLoadError,
  UpdateTasks
} from './task.actions';

@Injectable()
export class TaskEffects {
  @Effect()
  loadTasks$ = this.dataPersistence.fetch(TasksActionTypes.LoadTasks, {
    run: (action: LoadTasks, state: DalState) => {
      if (!action.payload.force && state.tasks.loaded) return;
      return this.taskService
        .getAllForUser(action.payload.userId)
        .pipe(map(tasks => new TasksLoaded({ tasks })));
    },
    onError: (action: LoadTasks, error) => {
      return new TasksLoadError(error);
    }
  });

  @Effect()
  updateTasks$ = this.dataPersistence.pessimisticUpdate(
    TasksActionTypes.StartUpdateTasks,
    {
      run: (action: StartUpdateTasks, state: DalState) => {
        return this.taskService['updateTasks'](action.payload).pipe(
          switchMap(taskUpdateResult => {
            const { tasks, errors } = taskUpdateResult;
            const actions = [];

            if (Array.isArray(tasks) && tasks.length) {
              const partialUpdates = tasks.reduce(
                (acc, task) => [...acc, { id: task.id, changes: task }],
                []
              ) as Update<TaskInterface>[];

              actions.push(new UpdateTasks({ tasks: partialUpdates }));
            }

            if (!(Array.isArray(errors) && errors.length)) {
              const errorMessage = this.getBannerMessageHTML();
              actions.push(
                new AddEffectFeedback({
                  effectFeedback: {
                    ...EffectFeedback.generateErrorFeedback(
                      this.uuid(),
                      action,
                      errorMessage
                    ),
                    userActions: []
                  }
                })
              );
              return from(actions);
            }
          })
        );
      },
      onError: (action: StartUpdateTasks, error: any) => {
        const feedbackAction = new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            this.uuid(),
            action,
            'Het is niet gelukt om de taken te updaten.'
          )
        });
        return feedbackAction;
      }
    }
  );

  private getBannerMessageHTML();

  constructor(
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface,
    @Inject(UNDO_SERVICE_TOKEN) private undoService: UndoServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
