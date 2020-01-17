import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AuthServiceInterface, AUTH_SERVICE_TOKEN, DalState, EffectFeedback, EffectFeedbackActions, FavoriteActions, FavoriteInterface, FavoriteTypesEnum, getRouterState, LearningAreaInterface, RouterStateUrl, TaskActions, TaskEduContentInterface, TaskInterface } from '@campus/dal';
import { Update } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { AssigneeInterface, AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import { TaskStatusEnum, TaskWithAssigneesInterface } from '../interfaces/TaskWithAssignees.interface';
import { allowedLearningAreas, getTasksWithAssignments } from './kabas-tasks.viewmodel.selectors';

export interface CurrentTaskParams {
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class KabasTasksViewModel {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
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
      }),
      map(tasks =>
        tasks.map(task => ({
          ...task,
          ...this.getTaskDates(task)
        }))
      )
    );

    this.paperTasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, {
        isPaper: true,
        type: FavoriteTypesEnum.TASK
      }),
      map(tasks => tasks.map(task => ({ ...task, ...this.getTaskDates(task) })))
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

    this.selectableLearningAreas$ = this.store.pipe(
      select(allowedLearningAreas)
    );
  }

  public getTaskDates(
    task: TaskWithAssigneesInterface,
    now: Date = new Date()
  ): Pick<TaskWithAssigneesInterface, 'startDate' | 'endDate' | 'status'> {
    let startDate: Date;
    let endDate: Date;

    task.assignees.forEach(assignee => {
      if (!startDate || assignee.start < startDate) {
        startDate = assignee.start;
      }
      if (!endDate || assignee.end > endDate) {
        endDate = assignee.end;
      }
    });

    const status = this.getTaskStatus(startDate, endDate, now);
    return { startDate, endDate, status };
  }

  public getTaskStatus(
    startDate: Date,
    endDate: Date,
    now: Date = new Date()
  ): TaskStatusEnum {
    let status = TaskStatusEnum.PENDING;

    if (startDate && endDate) {
      // make sure dates are compared correctly
      startDate = new Date(startDate);
      endDate = new Date(endDate);

      if (endDate < now) {
        status = TaskStatusEnum.FINISHED;
      } else if (startDate <= now) {
        status = TaskStatusEnum.ACTIVE;
      }
    }
    return status;
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

  private getArchivingAction(updates, errors): Action {
    const updateAction = new TaskActions.StartArchiveTasks({
      userId: this.authService.userId,
      tasks: updates
    });
    if (errors.length) {
      const messages = this.stillActiveTaskFeedbackMessage(errors, 'archive');
      const effectFeedback = new EffectFeedback({
        id: this.uuid(),
        triggerAction: updateAction,
        message: `<p>Niet alle taken kunnen gearchiveerd worden:</p><ul>${messages}</ul>`,
        userActions: this.getFeedbackUserActions(updates.length, updateAction, 'archive'),
        type: 'error'
      });
      const feedbackAction = new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback
      });
      return feedbackAction;
    }
    return updateAction;
  }



  public updateTask(task: TaskInterface, assignees: AssigneeInterface[]) {
    this.store.dispatch(
      new TaskActions.UpdateTask({
        task: { id: task.id, changes: task },
        userId: this.authService.userId
      })
    );
    this.store.dispatch(
      new TaskActions.UpdateAccess({
        userId: this.authService.userId,
        taskId: task.id,
        ...this.getAssigneesByType(assignees)
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

  public removeTasks(tasks: TaskWithAssigneesInterface[]): void {
    const deleteIds = [];
    const errors = [];
    tasks.forEach(task => {
      if (this.canBeArchivedOrDeleted(task)) {
        deleteIds.push({ taskId: task.id });
      } else {
        errors.push(task);
      }
    });
    this.store.dispatch(this.getDestroyingAction(deleteIds, errors));
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

  private getDestroyingAction(deleteIds, errors) {
    const destroyAction = new TaskActions.StartDeleteTasks({
      ids: deleteIds,
      userId: this.authService.userId
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
          )}`
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
  public updateTaskEduContent(
    taskEduContents: TaskEduContentInterface[],
    updatedValues: Partial<TaskEduContentInterface>
  ): void {
    throw new Error('Not implemented yet');
  }
}
