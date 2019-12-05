import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { TaskClassGroupServiceInterface, TASK_CLASS_GROUP_SERVICE_TOKEN } from '../../task-class-group/task-class-group.service.interface';
import {
  TaskClassGroupsActionTypes,
  TaskClassGroupsLoadError,
  LoadTaskClassGroups,
  TaskClassGroupsLoaded
} from './task-class-group.actions';
import { DalState } from '..';

@Injectable()
export class TaskClassGroupEffects {
  @Effect()
  loadTaskClassGroups$ = this.dataPersistence.fetch(
    TaskClassGroupsActionTypes.LoadTaskClassGroups,
    {
      run: (action: LoadTaskClassGroups, state: DalState) => {
        if (!action.payload.force && state.taskClassGroups.loaded) return;
        return this.taskClassGroupService
          .getAllForUser(action.payload.userId)
          .pipe(map(taskClassGroups => new TaskClassGroupsLoaded({ taskClassGroups })));
      },
      onError: (action: LoadTaskClassGroups, error) => {
        return new TaskClassGroupsLoadError(error);
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_CLASS_GROUP_SERVICE_TOKEN)
    private taskClassGroupService: TaskClassGroupServiceInterface
  ) {}
}
