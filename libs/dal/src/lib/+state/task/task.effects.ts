import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DalState } from '..';
import { TaskInterface } from '../../+models';
import {
  TaskServiceInterface,
  TaskUpdateInfoInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import {
  EffectFeedback,
  EffectFeedbackActions,
  FeedbackTriggeringAction
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { TaskClassGroupActions } from '../task-class-group';
import { TaskGroupActions } from '../task-group';
import { TaskStudentActions } from '../task-student';
import {
  AddTask,
  DeleteTasks,
  LoadTasks,
  NavigateToTaskDetail,
  StartAddTask,
  StartArchiveTasks,
  StartDeleteTasks,
  TasksActionTypes,
  TasksLoaded,
  TasksLoadError,
  UpdateAccess,
  UpdateTasks
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

  updateAccess$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.UpdateAccess, {
      run: (action: UpdateAccess, state: DalState) => {
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
      onError: (action: UpdateAccess, error: any) => {
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
    })
  );

  startAddTask$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.StartAddTask, {
      run: (action: StartAddTask, state: DalState) => {
        return this.taskService
          .createTask(action.payload.userId, action.payload.task)
          .pipe(
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

  deleteTasks$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.StartDeleteTasks, {
      run: (action: StartDeleteTasks, state: DalState) => {
        return this.taskService
          .deleteTasks(action.payload.userId, action.payload.ids)
          .pipe(
            switchMap((taskDestroyResult: TaskUpdateInfoInterface) => {
              const actions = [];
              const { tasks, errors } = taskDestroyResult;

              // remove the destroyed ones from the store
              if (this.isFilled(tasks)) {
                actions.push(
                  new DeleteTasks({
                    ids: tasks.map(task => task.id)
                  })
                );

                // show a snackbar if there is no other feedback (i.e. no errors)
                if (!this.isFilled(errors)) {
                  const message = this.getTaskUpdateSuccessMessage(
                    tasks.length,
                    'delete'
                  );
                  actions.push(
                    this.getTaskUpdateFeedbackAction(action, message, 'success')
                  );
                }
              }
              // show feedback for the ones still in use
              if (this.isFilled(errors)) {
                const errorMessage = this.getTaskUpdateErrorMessageHTML(
                  taskDestroyResult,
                  'delete'
                );
                actions.push(
                  this.getTaskUpdateFeedbackAction(
                    action,
                    errorMessage,
                    'error'
                  )
                );
              }
              return from(actions);
            })
          );
      },
      onError: (action: StartDeleteTasks, error) => {
        return this.getTaskUpdateOnErrorFeedbackAction(action, 'delete');
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

  startArchiveTasks$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.StartArchiveTasks, {
      run: (action: StartArchiveTasks, state: DalState) => {
        return this.taskService
          .updateTasks(
            action.payload.userId,
            action.payload.tasks.map(updateTask => {
              return { ...updateTask.changes, id: +updateTask.id };
            })
          )
          .pipe(
            switchMap((taskUpdateInfo: TaskUpdateInfoInterface) => {
              const { tasks, errors } = taskUpdateInfo;
              const actions = [];

              if (this.isFilled(tasks)) {
                const partialUpdates = tasks.reduce(
                  (acc, task) => [...acc, { id: task.id, changes: task }],
                  []
                ) as Update<TaskInterface>[];

                actions.push(new UpdateTasks({ tasks: partialUpdates }));

                if (!this.isFilled(errors)) {
                  const message = this.getTaskUpdateSuccessMessage(
                    tasks.length,
                    this.intentToArchive(action) ? 'archive' : 'dearchive'
                  );
                  actions.push(
                    this.getTaskUpdateFeedbackAction(action, message, 'success')
                  );
                }
              }

              if (this.isFilled(errors)) {
                const errorMessage = this.getTaskUpdateErrorMessageHTML(
                  taskUpdateInfo,
                  this.intentToArchive(action) ? 'archive' : 'dearchive'
                );
                actions.push(
                  this.getTaskUpdateFeedbackAction(
                    action,
                    errorMessage,
                    'error'
                  )
                );
              }
              return from(actions);
            })
          );
      },
      onError: (action: StartArchiveTasks, error: any) => {
        return this.getTaskUpdateOnErrorFeedbackAction(
          action,
          this.intentToArchive(action) ? 'archive' : 'dearchive'
        );
      }
    })
  );

  private getTaskUpdateSuccessMessage(
    tasksLength: number,
    method: 'archive' | 'dearchive' | 'delete'
  ): string {
    const methodVerbs = {
      archive: 'gearchiveerd',
      dearchive: 'gedearchiveerd',
      delete: 'verwijderd'
    };

    return `De ${tasksLength === 1 ? 'taak werd' : 'taken werden'} ${
      methodVerbs[method]
    }.`;
  }

  private getTaskUpdateErrorMessageHTML(
    taskUpdateInfo: TaskUpdateInfoInterface,
    method: 'archive' | 'dearchive' | 'delete'
  ) {
    const { tasks, errors } = taskUpdateInfo;
    const methodVerbs = {
      archive: 'gearchiveerd',
      dearchive: 'gedearchiveerd',
      delete: 'verwijderd'
    };
    const verb = methodVerbs[method];

    const html = [];

    if (!tasks.length) {
      html.push(`<p>Er werden geen taken ${verb}.</p>`);
    } else if (tasks.length === 1) {
      html.push(`<p>De taak werd ${verb}.</p>`);
    } else {
      html.push(`<p>Er werden ${tasks.length} taken ${verb}.</p>`);
    }
    html.push('<p>De volgende taken zijn nog in gebruik:</p>');
    html.push('<ul>');
    html.push(
      ...errors.map(
        error =>
          `<li><strong>${error.task}</strong> is nog in gebruik door ${
            error.user
          } tot ${error.activeUntil.toLocaleDateString(this.dateLocale)}.</li>`
      )
    );
    html.push('</ul>');

    return html.join('');
  }

  private getTaskUpdateFeedbackAction(
    action: FeedbackTriggeringAction,
    message: string,
    type: 'error' | 'success'
  ): any {
    const effectFeedback =
      type === 'success'
        ? EffectFeedback.generateSuccessFeedback(this.uuid(), action, message)
        : {
            ...EffectFeedback.generateErrorFeedback(
              this.uuid(),
              action,
              message
            ),
            userActions: [] // don't add a retry button
          };

    return new AddEffectFeedback({
      effectFeedback
    });
  }

  private getTaskUpdateOnErrorFeedbackAction(
    action: FeedbackTriggeringAction,
    method: 'archive' | 'dearchive' | 'delete'
  ) {
    const methodVerbs = {
      archive: 'te archiveren',
      dearchive: 'te dearchiveren',
      delete: 'te verwijderen'
    };
    const feedbackAction = new AddEffectFeedback({
      effectFeedback: EffectFeedback.generateErrorFeedback(
        this.uuid(),
        action,
        `Het is niet gelukt om de taken ${methodVerbs[method]}.`
      )
    });
    return feedbackAction;
  }

  /* Small helpers */
  private intentToArchive = action =>
    action.payload.tasks.some(task => task.changes.archived);
  private isFilled = arr => Array.isArray(arr) && arr.length;

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    private router: Router,
    @Inject(MAT_DATE_LOCALE) private dateLocale,
    @Inject('uuid') private uuid: Function,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {}
}
