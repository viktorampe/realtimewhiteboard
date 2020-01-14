import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Effect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { DataPersistence } from '@nrwl/angular';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import { TaskInterface } from '../../+models';
import { TaskServiceInterface, TASK_SERVICE_TOKEN } from '../../tasks/task.service.interface';
import { EffectFeedback, FeedbackTriggeringAction } from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import { TaskUpdateInfoInterface } from './../../tasks/task.service.interface';
import { LoadTasks, StartUpdateTasks, TasksActionTypes, TasksLoaded, TasksLoadError, UpdateTasks } from './task.actions';

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
  startUpdateTasks$ = this.dataPersistence.pessimisticUpdate(
    TasksActionTypes.StartUpdateTasks,
    {
      run: (action: StartUpdateTasks, state: DalState) => {
        return this.taskService['updateTasks'](action.payload).pipe(
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
                  'update'
                );
                actions.push(
                  this.getTaskUpdateFeedbackAction(action, message, 'success')
                );
              }
            }

            if (this.isFilled(errors)) {
              const errorMessage = this.getTaskUpdateErrorMessageHTML(
                taskUpdateInfo, 
                'update'
              );
              actions.push(
                this.getTaskUpdateFeedbackAction(action, errorMessage, 'error')
              );
            }
            return from(actions);
          })
        );
      },
      onError: (action: StartUpdateTasks, error: any) => {
        return this.getTaskUpdateOnErrorFeedback(action, 'update');
      }
    }
  );

  private isFilled = arr => Array.isArray(arr) && arr.length;

  // @TODO: refactor to use Davids private method here
  // @see: PR https://dev.azure.com/diekeure-webdev/LK2020/_git/campus/pullrequest/99?_a=files
  private getTaskUpdateErrorMessageHTML(
    taskUpdateInfo: TaskUpdateInfoInterface,
    method: 'archive'| 'delete'| 'update'
  ) {
    const { tasks, errors } = taskUpdateInfo;
    const methodVerbs = {
      archive: 'gearchiveerd',
      delete: 'verwijderd',
      update: 'opgeslagen'
    };
    const verb = methodVerbs[method];]

    const html = [];

    if (!taskUpdateInfo.tasks.length) {
      html.push(`<p>Er werden geen taken ${verb}.</p>`);
    } else if (taskUpdateInfo.tasks.length === 1) {
      html.push(`<p>De taak werd ${verb}.</p>`);
    } else {
      html.push(`<p>Er werden ${
        taskUpdateInfo.tasks.length
      } taken ${verb}.</p>`);
    }
    html.push('<p>De volgende taken zijn nog in gebruik:</p>');
    html.push('<ul>');
    html.push(...taskUpdateInfo.errors
      .map(
        error =>
          `<li><strong>${error.task}</strong> is nog in gebruik door ${
            error.user
          } tot ${error.activeUntil.toLocaleDateString(this.dateLocale)}.</li>`
      ));
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

  private getTaskUpdateSuccessMessage(
    tasksLength: number,
    method: 'archive' | 'update' | 'delete'
  ): string {
    const methodVerbs = {
      archive: 'gearchiveerd',
      delete: 'verwijderd',
      update: 'opgeslagen'
    };

    return `De ${tasksLength === 1 ? 'taak werd' : 'taken werden'} ${
      methodVerbs[method]
    }.`;
  }

  private getTaskUpdateOnErrorFeedback(
    action: FeedbackTriggeringAction,
    method: 'archive' | 'update' | 'delete'
  ) {
    const methodVerbs = {
      archive: 'te archiveren',
      delete: 'te verwijderen',
      update: 'op te slaan'
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

  constructor(
    private dataPersistence: DataPersistence<DalState>,
    @Inject(MAT_DATE_LOCALE) private dateLocale,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface,
    @Inject('uuid') private uuid: Function
  ) {}
}
