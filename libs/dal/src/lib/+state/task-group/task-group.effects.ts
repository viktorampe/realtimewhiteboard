import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskGroupServiceInterface,
  TASK_GROUP_SERVICE_TOKEN
} from '../../tasks/task-group.service.interface';
import {
  loadTaskGroups,
  taskGroupsLoaded,
  taskGroupsLoadError
} from './task-group.actions';

@Injectable()
export class TaskGroupEffects {
  @Effect()
  loadTaskGroups$ = this.dataPersistence.fetch(loadTaskGroups, {
    run: (action: ReturnType<typeof loadTaskGroups>, state: DalState) => {
      if (!action.force && state.taskGroups.loaded) return;
      return this.taskGroupService
        .getAllForUser(action.userId)
        .pipe(map(taskGroups => taskGroupsLoaded({ taskGroups })));
    },
    onError: (action: ReturnType<typeof loadTaskGroups>, error) => {
      return taskGroupsLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_GROUP_SERVICE_TOKEN)
    private taskGroupService: TaskGroupServiceInterface
  ) {}
}
