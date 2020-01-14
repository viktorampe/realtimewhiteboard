import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TaskActions } from '.';
import { DalState } from '..';
import { TaskInterface } from '../../+models';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { EffectFeedback, EffectFeedbackActions } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { TaskClassGroupActions } from '../task-class-group';
import { TaskGroupActions } from '../task-group';
import { TaskStudentActions } from '../task-student';
import {
  AddTask,
  LoadTasks,
  NavigateToTaskDetail,
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

  startAddTask$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.StartAddTask, {
      run: (action: StartAddTask, state: DalState) => {
        // TODO: don't avoid typescript
        return this.taskService['createTask'](
          action.payload.userId,
          action.payload.task
        ).pipe(
          switchMap((task: TaskInterface) => {
            const actionsToDispatch: Action[] = [new AddTask({ task })];
            if (action.payload.navigateAfterCreate) {
              actionsToDispatch.push(new NavigateToTaskDetail({ task }));
            }
            return from(actionsToDispatch);
          })
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

  redirectToTask$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(TasksActionTypes.NavigateToTaskDetail),
        tap((action: NavigateToTaskDetail) => {
          this.router.navigate(['tasks', 'manage', action.payload.task.id]);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface,
    @Inject('uuid') private uuid: Function,
    private router: Router
  ) {}
}
