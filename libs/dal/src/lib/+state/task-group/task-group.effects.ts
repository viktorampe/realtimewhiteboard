import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskGroupServiceInterface,
  TASK_GROUP_SERVICE_TOKEN
} from '../../tasks/task-group.service.interface';
import {
  LoadTaskGroups,
  TaskGroupsActionTypes,
  TaskGroupsLoaded,
  TaskGroupsLoadError
} from './task-group.actions';

@Injectable()
export class TaskGroupEffects {
  @Effect()
  loadTaskGroups$ = this.dataPersistence.fetch(
    TaskGroupsActionTypes.LoadTaskGroups,
    {
      run: (action: LoadTaskGroups, state: DalState) => {
        if (!action.payload.force && state.taskGroups.loaded) return;
        return this.taskGroupService
          .getAllForUser(action.payload.userId)
          .pipe(map(taskGroups => new TaskGroupsLoaded({ taskGroups })));
      },
      onError: (action: LoadTaskGroups, error) => {
        return new TaskGroupsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_GROUP_SERVICE_TOKEN)
    private taskGroupService: TaskGroupServiceInterface
  ) {}
}
