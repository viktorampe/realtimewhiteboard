import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { TaskServiceInterface, TASK_SERVICE_TOKEN } from '../../task/task.service.interface';
import {
  TasksActionTypes,
  TasksLoadError,
  LoadTasks,
  TasksLoaded
} from './task.actions';
import { DalState } from '..';

@Injectable()
export class TasksEffects {
  @Effect()
  loadTasks$ = this.dataPersistence.fetch(
    TasksActionTypes.LoadTasks,
    {
      run: (action: LoadTasks, state: DalState) => {
        if (!action.payload.force && state.tasks.loaded) return;
        return this.taskService
          .getAll()
          .pipe(map(tasks => new TasksLoaded({ tasks })));
      },
      onError: (action: LoadTasks, error) => {
        return new TasksLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_SERVICE_TOKEN)
    private taskService: TaskServiceInterface
  ) {}
}
