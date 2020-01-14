import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TaskActions } from '.';
import { DalState } from '..';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import { TaskClassGroupActions } from '../task-class-group';
import { TaskGroupActions } from '../task-group';
import { TaskStudentActions } from '../task-student';
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

  @Effect()
  updateAccess$ = this.dataPersistence.pessimisticUpdate(
    TasksActionTypes.UpdateAccess,
    {
      run: (action: TaskActions.UpdateAccess, state: DalState) => {
        return this.taskService
          .updateAccess(
            action.payload.userId,
            action.payload.taskId,
            action.payload.taskGroups,
            action.payload.taskStudents,
            action.payload.taskClassGroups
          )
          .pipe(
            switchMap(response =>
              from([
                TaskGroupActions.updateTaskGroupsAccess({
                  taskId: action.payload.taskId,
                  taskGroups: response.taskGroups
                }),
                TaskClassGroupActions.updateTaskClassGroupsAccess({
                  taskId: action.payload.taskId,
                  taskClassGroups: response.taskClassGroups
                }),
                TaskStudentActions.updateTaskStudentsAccess({
                  taskId: action.payload.taskId,
                  taskStudents: response.taskStudents
                })
              ])
            )
          );
      },
      onError: (action: TaskActions.UpdateAccess, error: any) => {
        const effectFeedback = EffectFeedback.generateErrorFeedback(
          this.uuid(),
          action,
          'Het is niet gelukt om de taak toe te wijzen.'
        );

        const effectFeedbackAction = new EffectFeedbackActions.AddEffectFeedback(
          { effectFeedback }
        );
        return effectFeedbackAction;
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface,

    @Inject('uuid') private uuid: Function
  ) {}
}
