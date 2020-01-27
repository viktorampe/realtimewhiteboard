import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupInterface,
  ClassGroupQueries,
  DalState,
  EffectFeedback,
  EffectFeedbackActions,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  getRouterState,
  GroupInterface,
  GroupQueries,
  LearningAreaInterface,
  LinkedPersonQueries,
  PersonInterface,
  RouterStateUrl,
  TaskActions,
  TaskClassGroupInterface,
  TaskEduContentActions,
  TaskEduContentInterface,
  TaskGroupInterface,
  TaskInterface,
  TaskServiceInterface,
  TaskStudentInterface,
  TASK_SERVICE_TOKEN
} from '@campus/dal';
import { Update } from '@ngrx/entity';
import { RouterReducerState } from '@ngrx/router-store';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap
} from 'rxjs/operators';
import { AssigneeTypesEnum } from '../interfaces/Assignee.interface';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { AssigneeInterface } from './../interfaces/Assignee.interface';
import {
  allowedLearningAreas,
  getTasksWithAssignmentsByType,
  getTaskWithAssignmentAndEduContents
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

  public classGroups$: Observable<ClassGroupInterface[]>;
  public groups$: Observable<GroupInterface[]>;
  public students$: Observable<PersonInterface[]>;

  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject('uuid') private uuid: Function,
    @Inject(MAT_DATE_LOCALE) private dateLocale,
    @Inject(TASK_SERVICE_TOKEN) private taskService: TaskServiceInterface
  ) {
    this.tasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignmentsByType, {
        isPaper: false
      })
    );

    this.paperTasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignmentsByType, {
        isPaper: true
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

    this.classGroups$ = this.store.pipe(select(ClassGroupQueries.getAll));
    this.groups$ = this.store.pipe(select(GroupQueries.getAll));
    this.students$ = this.store.pipe(select(LinkedPersonQueries.getStudents));
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
        ...this.getAssigneesByType(assignees, task.id)
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
    assignees: AssigneeInterface[],
    taskId: number
  ): {
    taskGroups: TaskGroupInterface[];
    taskStudents: TaskStudentInterface[];
    taskClassGroups: TaskClassGroupInterface[];
  } {
    const keyMap = this.getAssigneeTypeToKeyMap();
    return assignees.reduce(
      (acc, assignee) => ({
        ...acc,
        [keyMap[assignee.type]]: [
          ...acc[keyMap[assignee.type]],
          this.mapAssigneeToTaskAssignee(assignee, taskId)
        ]
      }),
      { taskGroups: [], taskStudents: [], taskClassGroups: [] }
    );
  }

  private mapAssigneeToTaskAssignee(
    assignee: AssigneeInterface,
    taskId: number
  ): TaskClassGroupInterface | TaskGroupInterface | TaskStudentInterface {
    const taskAssignee: any = {
      id: assignee.id,
      start: assignee.start,
      end: assignee.end,
      taskId
    };

    switch (assignee.type) {
      case AssigneeTypesEnum.CLASSGROUP:
        taskAssignee.classGroupId = assignee.relationId;
        break;
      case AssigneeTypesEnum.GROUP:
        taskAssignee.groupId = assignee.relationId;
        break;
      case AssigneeTypesEnum.STUDENT:
        taskAssignee.personId = assignee.relationId;
        break;
    }

    return taskAssignee;
  }

  public getDeleteInfo(
    tasks: TaskWithAssigneesInterface[]
  ): {
    deletableTasks: TaskWithAssigneesInterface[];
    message: string;
    disableConfirmButton: boolean;
  } {
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
    return this.currentTaskParams$.pipe(
      filter(taskParams => !!taskParams.id),
      switchMap(currentTaskParams => {
        return this.store.pipe(
          select(getTaskWithAssignmentAndEduContents, {
            taskId: currentTaskParams.id
          })
        );
      })
    );
  }

  public updateTaskEduContentsRequired(
    taskEduContents: TaskEduContentInterface[],
    required: boolean
  ) {
    throw new Error('Not implemented yet');
  }

  public updateTaskEduContentsOrder(
    taskEduContents: TaskEduContentInterface[]
  ) {
    throw new Error('Not implemented yet');
  }

  public deleteTaskEduContents(taskEduContents: TaskEduContentInterface[]) {
    this.store.dispatch(
      new TaskEduContentActions.StartDeleteTaskEduContents({
        taskEduContentIds: taskEduContents.map(tec => tec.id),
        userId: this.authService.userId
      })
    );
  }

  public printTask(taskId: number, withNames: boolean) {
    this.taskService.printTask(taskId, withNames);
  }

  public printSolution(taskId: number) {
    this.taskService.printSolution(taskId);
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

    if (errors.length) {
      body = this.stillActiveTaskFeedbackMessage(errors, 'delete');
      if (deletableTasks.length) {
        confirmQuestion =
          '<p>Ben je zeker dat je de andere taken wil verwijderen?</p>';
      }
    }

    return `${body}${confirmQuestion}`;
  }
}
