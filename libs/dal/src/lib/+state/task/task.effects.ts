import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import {
  LoadTasks,
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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {}
}
