import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskClassGroupServiceInterface,
  TASK_CLASS_GROUP_SERVICE_TOKEN
} from '../../tasks/task-class-group.service.interface';
import {
  loadTaskClassGroups,
  taskClassGroupsLoaded,
  taskClassGroupsLoadError
} from './task-class-group.actions';

@Injectable()
export class TaskClassGroupEffects {
  @Effect()
  loadTaskClassGroups$ = this.dataPersistence.fetch(loadTaskClassGroups, {
    run: (action: ReturnType<typeof loadTaskClassGroups>, state: DalState) => {
      if (!action.force && state.taskClassGroups.loaded) return;
      return this.taskClassGroupService
        .getAllForUser(action.userId)
        .pipe(
          map(taskClassGroups => taskClassGroupsLoaded({ taskClassGroups }))
        );
    },
    onError: (action: ReturnType<typeof loadTaskClassGroups>, error) => {
      return taskClassGroupsLoadError({ error });
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_CLASS_GROUP_SERVICE_TOKEN)
    private taskClassGroupService: TaskClassGroupServiceInterface
  ) {}
}
