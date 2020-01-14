import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
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
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddTask,
  DeleteTasks,
  LoadTasks,
  NavigateToTaskDetail,
  StartAddTask,
  StartDeleteTasks,
  TasksActionTypes,
  TasksLoaded,
  TasksLoadError
} from './task.actions';

@Injectable()
export class TaskEffects {
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
              if (Array.isArray(tasks) && tasks.length) {
                actions.push(
                  new DeleteTasks({
                    ids: tasks.map(task => task.id)
                  })
                );

                // show a snackbar if there is no other feedback (i.e. no errors)
                if (!(Array.isArray(errors) && errors.length)) {
                  const successMessage = `De ${
                    tasks.length > 1 ? 'taken werden' : 'taak werd'
                  } verwijderd.`;

                  actions.push(
                    new AddEffectFeedback({
                      effectFeedback: EffectFeedback.generateSuccessFeedback(
                        this.uuid(),
                        action,
                        successMessage
                      )
                    })
                  );
                }
              }

              // show feedback for the ones still in use
              if (Array.isArray(errors) && errors.length) {
                const errorMessage = this.getBannerMessageHTML(
                  taskDestroyResult
                );

                actions.push(
                  new AddEffectFeedback({
                    effectFeedback: {
                      ...EffectFeedback.generateErrorFeedback(
                        this.uuid(),
                        action,
                        errorMessage
                      ),
                      userActions: [] // don't retry, some tasks may have already been deleted
                    }
                  })
                );
              }
              return from(actions);
            })
          );
      },
      onError: (action: StartDeleteTasks, error) => {
        return new AddEffectFeedback({
          effectFeedback: EffectFeedback.generateErrorFeedback(
            this.uuid(),
            action,
            'Het is niet gelukt om de taken te verwijderen.'
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
    private router: Router,
    @Inject(MAT_DATE_LOCALE) private dateLocale,
    @Inject('uuid') private uuid: Function,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {}

  private getBannerMessageHTML(taskUpdateResult: TaskUpdateInfoInterface) {
    let errorHTML = '';

    if (!taskUpdateResult.tasks.length) {
      errorHTML += '<p>Er werden geen taken verwijderd.</p>';
    } else if (taskUpdateResult.tasks.length === 1) {
      errorHTML += '<p>De taak werd verwijderd.</p>';
    } else {
      errorHTML += `<p>Er werden ${taskUpdateResult.tasks.length} taken verwijderd.</p>`;
    }

    errorHTML += '<p>De volgende taken zijn nog in gebruik:</p>';
    errorHTML += '<ul>';
    errorHTML += taskUpdateResult.errors
      .map(
        error =>
          `<li><b>${error.task}</b> is nog in gebruik door ${
            error.user
          } tot ${error.activeUntil.toLocaleDateString(this.dateLocale)}. </li>`
      )
      .join('');
    errorHTML += '</ul>';

    return errorHTML;
  }
}
