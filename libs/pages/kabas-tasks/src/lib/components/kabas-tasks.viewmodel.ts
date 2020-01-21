import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentFixture,
  EffectFeedback,
  EffectFeedbackActions,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  getRouterState,
  LearningAreaFixture,
  LearningAreaInterface,
  RouterStateUrl,
  TaskActions,
  TaskEduContentFixture,
  TaskEduContentInterface,
  TaskInterface
} from '@campus/dal';
import { Update } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import {
  allowedLearningAreas,
  getTasksWithAssignments
} from './kabas-tasks.viewmodel.selectors';

export interface CurrentTaskParams {
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class KabasTasksViewModel {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public currentTask$: Observable<TaskWithAssigneesInterface>;
  public currentTaskParams$: Observable<CurrentTaskParams>;
  public selectableLearningAreas$: Observable<LearningAreaInterface[]>;

  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject('uuid') private uuid: Function,
    @Inject(MAT_DATE_LOCALE) private dateLocale
  ) {
    this.tasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, {
        isPaper: false,
        type: FavoriteTypesEnum.TASK
      })
    );

    this.paperTasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, {
        isPaper: true,
        type: FavoriteTypesEnum.TASK
      })
    );

    this.routerState$ = this.store.pipe(select(getRouterState));
    this.currentTaskParams$ = this.routerState$.pipe(
      filter(routerState => !!routerState),
      map((routerState: RouterReducerState<RouterStateUrl>) => ({
        id: +routerState.state.params.id || undefined
      })),
      distinctUntilChanged((a, b) => a.id === b.id),
      shareReplay(1)
    );

    this.currentTask$ = this.getCurrentTask();

    this.selectableLearningAreas$ = this.store.pipe(
      select(allowedLearningAreas)
    );
  }

  public startArchivingTasks(
    tasks: TaskWithAssigneesInterface[],
    shouldArchive: boolean
  ): void {
    const updates: Update<TaskInterface>[] = [];
    const errors: TaskWithAssigneesInterface[] = [];

    tasks.forEach(task => {
      if (!shouldArchive || this.canBeArchivedOrDeleted(task)) {
        updates.push({ id: task.id, changes: { archived: shouldArchive } });
      } else {
        errors.push(task);
      }
    });

    this.store.dispatch(this.getArchivingAction(updates, errors));
  }

  public updateTaskAccess(task: TaskInterface, assignees: AssigneeInterface[]) {
    this.store.dispatch(
      new TaskActions.UpdateAccess({
        userId: this.authService.userId,
        taskId: task.id,
        ...this.getAssigneesByType(assignees)
      })
    );
  }
  public updateTask(task: TaskInterface) {
    this.store.dispatch(
      new TaskActions.UpdateTask({
        task: { id: task.id, changes: task },
        userId: this.authService.userId
      })
    );
  }

  private getAssigneeTypeToKeyMap() {
    return {
      [AssigneeTypesEnum.GROUP]: 'taskGroups',
      [AssigneeTypesEnum.STUDENT]: 'taskStudents',
      [AssigneeTypesEnum.CLASSGROUP]: 'taskClassGroups'
    };
  }

  private getAssigneesByType(
    assignees: AssigneeInterface[]
  ): {
    taskGroups: AssigneeInterface[];
    taskStudents: AssigneeInterface[];
    taskClassGroups: AssigneeInterface[];
  } {
    const keyMap = this.getAssigneeTypeToKeyMap();
    return assignees.reduce(
      (acc, assignee) => ({
        ...acc,
        [keyMap[assignee.type]]: [...acc[keyMap[assignee.type]], assignee]
      }),
      { taskGroups: [], taskStudents: [], taskClassGroups: [] }
    );
  }

  public getDeleteInfo(tasks: TaskWithAssigneesInterface[]) {
    const deletableTasks = [];
    const nonDeletableTasks = [];

    tasks.forEach(task => {
      if (this.canBeArchivedOrDeleted(task)) {
        deletableTasks.push(task);
      } else {
        nonDeletableTasks.push(task);
      }
    });

    const message = this.getDeleteConfirmationMessage(
      nonDeletableTasks,
      deletableTasks
    );

    return {
      deletableTasks,
      message,
      disableConfirmButton: nonDeletableTasks.length === tasks.length
    };
  }

  public removeTasks(
    tasks: TaskWithAssigneesInterface[],
    navigateAfterDelete?: boolean
  ): void {
    this.store.dispatch(
      new TaskActions.StartDeleteTasks({
        ids: tasks.map(task => task.id),
        userId: this.authService.userId,
        navigateAfterDelete
      })
    );
  }

  public toggleFavorite(task: TaskWithAssigneesInterface): void {
    const favorite: FavoriteInterface = {
      created: new Date(),
      name: task.name,
      taskId: task.id,
      type: FavoriteTypesEnum.TASK
    };
    this.store.dispatch(new FavoriteActions.ToggleFavorite({ favorite }));
  }

  public canBeArchivedOrDeleted(task: TaskWithAssigneesInterface): boolean {
    return (
      task.isPaperTask ||
      task.status === TaskStatusEnum.FINISHED ||
      (!task.endDate && !task.startDate)
    );
  }

  public createTask(
    name: string,
    learningAreaId: number,
    type: 'paper' | 'digital'
  ): void {
    this.store.dispatch(
      new TaskActions.StartAddTask({
        task: { name, learningAreaId, isPaperTask: type === 'paper' },
        navigateAfterCreate: true,
        userId: this.authService.userId
      })
    );
  }

  private getCurrentTask(): Observable<TaskWithAssigneesInterface> {
    // TODO
    // return this.paperTasksWithAssignments$.pipe(
    return this.tasksWithAssignments$.pipe(
      map(tasks => ({
        ...tasks[0],
        taskEduContents: [1, 2, 3].map(
          id =>
            new TaskEduContentFixture({
              eduContentId: id,
              eduContent: new EduContentFixture(
                { id },
                {
                  id,
                  title: 'oefening ' + id,
                  learningArea: new LearningAreaFixture({
                    id: 1,
                    name: 'Wiskunde'
                  })
                }
              )
            })
        )
      }))
    );
  }

  public updateTaskEduContent(
    taskEduContents: TaskEduContentInterface[],
    updatedValues: Partial<TaskEduContentInterface>
  ): void {
    throw new Error('Not implemented yet');
  }

  private getArchivingAction(updates, errors): Action {
    const updateAction = new TaskActions.StartArchiveTasks({
      userId: this.authService.userId,
      tasks: updates
    });
    if (errors.length) {
      const effectFeedback = new EffectFeedback({
        id: this.uuid(),
        triggerAction: updateAction,
        message: this.stillActiveTaskFeedbackMessage(errors, 'archive'),
        userActions: this.getFeedbackUserActions(
          updates.length,
          updateAction,
          'archive'
        ),
        type: 'error'
      });
      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback
      });
      return feedbackAction;
    }
    return updateAction;
  }

  private getDestroyingAction(deleteIds, errors, navigateAfterDelete) {
    const destroyAction = new TaskActions.StartDeleteTasks({
      ids: deleteIds,
      userId: this.authService.userId,
      navigateAfterDelete
    });
    if (errors.length) {
      const effectFeedback = new EffectFeedback({
        id: this.uuid(),
        triggerAction: destroyAction,
        message: this.stillActiveTaskFeedbackMessage(errors, 'delete'),
        userActions: this.getFeedbackUserActions(
          deleteIds.length,
          destroyAction,
          'delete'
        ),
        type: 'error'
      });

      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback
      });
      return feedbackAction;
    }
    return destroyAction;
  }

  private getFeedbackUserActions(
    numberOfUpdates: number,
    userAction,
    method: 'delete' | 'archive'
  ) {
    const methodVerbs = {
      delete: 'Verwijder',
      archive: 'Archiveer'
    };

    return numberOfUpdates > 0
      ? [
          {
            title: `${methodVerbs[method]} de andere taken`,
            userAction
          }
        ]
      : [];
  }

  private stillActiveTaskFeedbackMessage(
    errors: TaskWithAssigneesInterface[],
    method: 'delete' | 'archive'
  ) {
    const methodVerbs = {
      delete: 'verwijderd',
      archive: 'gearchiveerd'
    };

    const list = errors.map(task => {
      const activeUntil = task.endDate
        ? ` Deze taak is nog actief tot ${task.endDate.toLocaleDateString(
            this.dateLocale
          )}.`
        : '';
      return `<li>${task.name} kan niet worden ${methodVerbs[method]}.${activeUntil}</li>`;
    });

    const message = [
      `<p>Niet alle taken kunnen ${methodVerbs[method]} worden:</p>`
    ];
    message.push('<ul>');
    message.push(...list);
    message.push('</ul>');
    return message.join('');
  }

  private getDeleteConfirmationMessage(
    errors: TaskWithAssigneesInterface[],
    deletableTasks: TaskWithAssigneesInterface[]
  ): string {
    let body = '';
    let confirmQuestion =
      '<p>Ben je zeker dat je de geselecteerde taken wil verwijderen?</p>';
    let disableConfirmButton = false;

    if (errors.length) {
      body = this.stillActiveTaskFeedbackMessage(errors, 'delete');
      if (deletableTasks.length) {
        confirmQuestion =
          '<p>Ben je zeker dat je de andere taken wil verwijderen?</p>';
      } else {
        confirmQuestion = '';
        disableConfirmButton = true;
      }
    }

    return `${body} ${confirmQuestion}`;
  }
}
