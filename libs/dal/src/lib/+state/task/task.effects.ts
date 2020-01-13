import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import { TaskInterface } from '../../+models';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddTask,
  LoadTasks,
  StartAddTask,
  TasksActionTypes,
  TasksLoaded,
  TasksLoadError
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

  startAddTask$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.StartAddTask, {
      run: (action: StartAddTask, state: DalState) => {
        // TODO: don't avoid typescript
        return this.taskService['createTask'](action.payload.task).pipe(
          map((task: TaskInterface) => new AddTask({ task }))
        );
      },
      onError: (action: StartAddTask, error) => {
        return new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            this.uuid(),
            action,
            'Het is niet gelukt om de taak te maken.'
          )
        });
      }
    })
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject('uuid') private uuid: Function,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {}
}
