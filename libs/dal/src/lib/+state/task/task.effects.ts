import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Actions, createEffect, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import { EffectFeedback } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  DeleteTasks,
  LoadTasks,
  StartDeleteTasks,
  TasksActionTypes,
  TasksLoaded,
  TasksLoadError
} from './task.actions';

interface TaskDestroyInfoInterface {
  tasks: {
    taskId: number;
  }[];
  errors: {
    task: string;
    activeUntil: Date;
    user: string;
  }[];
}

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

  deleteTasks$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(TasksActionTypes.StartDeleteTasks, {
      run: (action: StartDeleteTasks, state: DalState) => {
        // TODO typescript
        return this.taskService['deleteTasks'](action.payload.ids).pipe(
          switchMap((taskDestroyResult: TaskDestroyInfoInterface) => {
            const actions = [];
            const { tasks, errors } = taskDestroyResult;

            // remove the destroyed ones from the store
            if (Array.isArray(tasks) && tasks.length) {
              actions.push(
                new DeleteTasks({
                  ids: tasks.map(task => task.taskId)
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
              const errorMessage = this.getBannerMessageHTML(taskDestroyResult);

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

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(MAT_DATE_LOCALE) private dateLocale,
    @Inject('uuid') private uuid: Function,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {}

  private getBannerMessageHTML(taskDestroyResult: TaskDestroyInfoInterface) {
    let errorHTML = '';

    if (!taskDestroyResult.tasks.length) {
      errorHTML += '<p>Er werden geen taken verwijderd.</p>';
    } else if (taskDestroyResult.tasks.length === 1) {
      errorHTML += '<p>De taak werd verwijderd.</p>';
    } else {
      errorHTML += `<p>Er werden ${taskDestroyResult.tasks.length} taken verwijderd.</p>`;
    }

    errorHTML += '<p>De volgende taken zijn nog in gebruik:</p>';
    errorHTML += '<ul>';
    errorHTML += taskDestroyResult.errors
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
