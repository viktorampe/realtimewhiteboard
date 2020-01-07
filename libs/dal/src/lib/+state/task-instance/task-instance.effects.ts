import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskInstanceServiceInterface,
  TASK_INSTANCE_SERVICE_TOKEN
} from '../../tasks/task-instance.service.interface';
import {
  LoadTaskInstances,
  TaskInstancesActionTypes,
  TaskInstancesLoaded,
  TaskInstancesLoadError
} from './task-instance.actions';

@Injectable()
export class TaskInstanceEffects {
  @Effect()
  loadTaskInstances$ = this.dataPersistence.fetch(
    TaskInstancesActionTypes.LoadTaskInstances,
    {
      run: (action: LoadTaskInstances, state: DalState) => {
        if (!action.payload.force && state.taskInstances.loaded) return;
        return this.taskInstanceService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(taskInstances => new TaskInstancesLoaded({ taskInstances }))
          );
      },
      onError: (action: LoadTaskInstances, error) => {
        return new TaskInstancesLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_INSTANCE_SERVICE_TOKEN)
    private taskInstanceService: TaskInstanceServiceInterface
  ) {}
}
