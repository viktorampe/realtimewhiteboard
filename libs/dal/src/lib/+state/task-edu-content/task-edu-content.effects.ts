import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Actions, createEffect, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { undo } from 'ngrx-undo';
import { from } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { DalState } from '..';
import { TaskEduContentInterface } from '../../+models';
import {
  TaskEduContentServiceInterface,
  TASK_EDU_CONTENT_SERVICE_TOKEN,
  UpdateTaskEduContentResultInterface
} from '../../tasks/task-edu-content.service.interface';
import {
  TaskServiceInterface,
  TASK_SERVICE_TOKEN
} from '../../tasks/task.service.interface';
import {
  EffectFeedback,
  FeedbackTriggeringAction,
  Priority
} from '../effect-feedback';
import { AddEffectFeedback } from '../effect-feedback/effect-feedback.actions';
import {
  AddTaskEduContent,
  DeleteTaskEduContent,
  DeleteTaskEduContents,
  LinkTaskEduContent,
  LoadTaskEduContents,
  StartAddTaskEduContents,
  StartDeleteTaskEduContents,
  TaskEduContentsActionTypes,
  TaskEduContentsLoaded,
  TaskEduContentsLoadError,
  UpdateTaskEduContents
} from './task-edu-content.actions';

@Injectable()
export class TaskEduContentEffects {
  @Effect()
  loadTaskEduContents$ = this.dataPersistence.fetch(
    TaskEduContentsActionTypes.LoadTaskEduContents,
    {
      run: (action: LoadTaskEduContents, state: DalState) => {
        if (!action.payload.force && state.taskEduContents.loaded) return;
        return this.taskEduContentService
          .getAllForUser(action.payload.userId)
          .pipe(
            map(
              taskEduContents => new TaskEduContentsLoaded({ taskEduContents })
            )
          );
      },
      onError: (action: LoadTaskEduContents, error) => {
        return new TaskEduContentsLoadError(error);
      }
    }
  );

  @Effect()
  linkTaskEduContent$ = this.dataPersistence.pessimisticUpdate(
    TaskEduContentsActionTypes.LinkTaskEduContent,
    {
      run: (action: LinkTaskEduContent, state: DalState) => {
        return this.taskService
          .linkEduContent(action.payload.taskId, action.payload.eduContentId)
          .pipe(
            switchMap(taskEduContent => [
              new AddEffectFeedback({
                effectFeedback: new EffectFeedback({
                  id: this.uuid(),
                  triggerAction: action,
                  message: 'Het lesmateriaal werd aan de taak toegevoegd.',
                  type: 'success',
                  priority: Priority.NORM
                })
              }),
              new AddTaskEduContent({
                taskEduContent
              })
            ])
          );
      },
      onError: (action: LinkTaskEduContent, error) => {
        return new AddEffectFeedback({
          effectFeedback: new EffectFeedback({
            id: this.uuid(),
            triggerAction: action,
            message:
              'Het is niet gelukt om het lesmateriaal aan de taak toe te voegen.',
            userActions: [
              {
                title: 'Opnieuw proberen.',
                userAction: action
              }
            ],
            type: 'error',
            priority: Priority.HIGH
          })
        });
      }
    }
  );

  // not used in Kabas -> use deleteTaskEduContents$ (bulk, pessimistic)
  @Effect()
  deleteTaskEduContent$ = this.dataPersistence.optimisticUpdate(
    TaskEduContentsActionTypes.DeleteTaskEduContent,
    {
      run: (action: DeleteTaskEduContent, state: DalState) => {
        return this.taskEduContentService.remove(action.payload.id).pipe(
          mapTo(
            new AddEffectFeedback({
              effectFeedback: new EffectFeedback({
                id: this.uuid(),
                triggerAction: action,
                message: 'Het lesmateriaal is uit de taak verwijderd.'
              })
            })
          )
        );
      },
      undoAction: (action: DeleteTaskEduContent, error: any) => {
        // Something went wrong: could be a 401 or 404 ...
        const undoAction = undo(action);

        const effectFeedback = new EffectFeedback({
          id: this.uuid(),
          triggerAction: action,
          message:
            'Het is niet gelukt om het lesmateriaal uit de taak te verwijderen.',
          userActions: [{ title: 'Opnieuw', userAction: action }],
          type: 'error',
          priority: Priority.HIGH
        });

        const feedbackAction = new AddEffectFeedback({
          effectFeedback
        });

        // undo the failed action and trigger feedback for user
        return from<Action[]>([undoAction, feedbackAction]);
      }
    }
  );

  updateTaskEduContents$ = createEffect(() =>
    this.dataPersistence.optimisticUpdate(
      TaskEduContentsActionTypes.UpdateTaskEduContents,
      {
        run: (action: UpdateTaskEduContents, state: DalState) => {
          const updates = action.payload.taskEduContents.map(
            partialTaskEduContent =>
              ({
                id: partialTaskEduContent.id,
                ...partialTaskEduContent.changes
              } as TaskEduContentInterface)
          );
          return this.taskEduContentService
            .updateTaskEduContents(null, updates)
            .pipe(
              map(update => {
                return new AddEffectFeedback({
                  effectFeedback: EffectFeedback.generateSuccessFeedback(
                    this.uuid(),
                    action,
                    'De inhoud van de taak werd bijgewerkt.'
                  )
                });
              })
            );
        },
        undoAction: (action: UpdateTaskEduContents, error: any) => {
          return from([
            undo(action),
            new AddEffectFeedback({
              effectFeedback: EffectFeedback.generateErrorFeedback(
                this.uuid(),
                action,
                'Het is niet gelukt om de inhoud van de taak bij te werken.'
              )
            })
          ]);
        }
      }
    )
  );

  deleteTaskEduContents$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(
      TaskEduContentsActionTypes.StartDeleteTaskEduContents,
      {
        run: (action: StartDeleteTaskEduContents, state: DalState) => {
          return this.taskEduContentService
            .deleteTaskEduContents(
              action.payload.userId,
              action.payload.taskEduContentIds
            )
            .pipe(
              switchMap(
                (taskDestroyResult: UpdateTaskEduContentResultInterface) => {
                  const actions = [];
                  const { success, errors } = taskDestroyResult;

                  // remove the destroyed ones from the store
                  if (this.isFilled(success)) {
                    actions.push(
                      new DeleteTaskEduContents({
                        ids: success.map(taskEduContent => taskEduContent.id)
                      })
                    );

                    // show a snackbar if there is no other feedback (i.e. no errors)
                    if (!this.isFilled(errors)) {
                      const message = this.getTaskEduContentUpdateSuccessMessage(
                        success.length,
                        'delete'
                      );
                      actions.push(
                        this.getTaskEduContentUpdateFeedbackAction(
                          action,
                          message,
                          'success'
                        )
                      );
                    }
                  }

                  // show feedback for the ones still in use
                  if (this.isFilled(errors)) {
                    const errorMessage = this.getTaskEduContentUpdateErrorMessageHTML(
                      taskDestroyResult,
                      'delete'
                    );
                    actions.push(
                      this.getTaskEduContentUpdateFeedbackAction(
                        action,
                        errorMessage,
                        'error'
                      )
                    );
                  }
                  return from(actions);
                }
              )
            );
        },
        onError: (action: StartDeleteTaskEduContents, error) => {
          return this.getTaskEduContentUpdateOnErrorFeedbackAction(
            action,
            'delete'
          );
        }
      }
    )
  );

  createTaskEduContents$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(
      TaskEduContentsActionTypes.AddTaskEduContents,
      {
        run: (action: StartAddTaskEduContents, state: DalState) => {
          return this.taskEduContentService.createTaskEduContents(
            action.payload.userId,
            action.payload.taskEduContents
          );
        },

        onError: (action: StartAddTaskEduContents, error) => {
          return this.getTaskEduContentUpdateOnErrorFeedbackAction(
            action,
            'create'
          );
        }
      }
    )
  );

  private isFilled = arr => Array.isArray(arr) && arr.length;

  private getTaskEduContentUpdateSuccessMessage(
    taskEduContentsLength: number,
    method: 'delete'
  ): string {
    const methodVerbs = {
      delete: 'verwijderd'
    };

    return `Het lesmateriaal werd ${methodVerbs[method]}.`;
  }

  private getTaskEduContentUpdateErrorMessageHTML(
    taskUpdateInfo: UpdateTaskEduContentResultInterface,
    method: 'delete'
  ) {
    const { success, errors } = taskUpdateInfo;
    const methodVerbs = {
      delete: 'verwijderd'
    };
    const verb = methodVerbs[method];

    const html = [];

    if (!success.length) {
      html.push(`<p>Er werd geen lesmateriaal ${verb}.</p>`);
    } else if (success.length === 1) {
      html.push(`<p>Het lesmateriaal werd ${verb}.</p>`);
    } else {
      html.push(
        `<p>Er werden ${success.length} lesmateriaal items ${verb}.</p>`
      );
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

  private getTaskEduContentUpdateFeedbackAction(
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

  private getTaskEduContentUpdateOnErrorFeedbackAction(
    action: FeedbackTriggeringAction,
    method: 'archive' | 'dearchive' | 'delete' | 'create'
  ) {
    const methodVerbs = {
      archive: 'te archiveren',
      dearchive: 'te dearchiveren',
      delete: 'te verwijderen',
      create: 'toe te voegen'
    };
    const feedbackAction = new AddEffectFeedback({
      effectFeedback: EffectFeedback.generateErrorFeedback(
        this.uuid(),
        action,
        `Het is niet gelukt om het lesmateriaal ${methodVerbs[method]}.`
      )
    });
    return feedbackAction;
  }

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(TASK_EDU_CONTENT_SERVICE_TOKEN)
    private taskEduContentService: TaskEduContentServiceInterface,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface,
    @Inject('uuid') private uuid: Function,
    @Inject(MAT_DATE_LOCALE) private dateLocale
  ) {}
}
