import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  getRouterState,
  LearningAreaInterface,
  RouterStateUrl,
  TaskActions,
  TaskInterface,
  TaskEduContentInterface
} from '@campus/dal';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
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
  public currentTaskParams$: Observable<CurrentTaskParams>;
  public selectableLearningAreas$: Observable<LearningAreaInterface[]>;

  private routerState$: Observable<RouterReducerState<RouterStateUrl>>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.tasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, { isPaper: false }),
      map(tasks => tasks.map(task => ({ ...task, ...this.getTaskDates(task) })))
    );

    this.paperTasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, { isPaper: true }),
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

  // TODO replace with correct implementation
  // from PR https://diekeure-webdev@dev.azure.com/diekeure-webdev/LK2020/_git/campus/pullrequest/110?view=discussion
  // Refactored the necessary parts here to fix tests
  // NO REVIEW REQUIRED HERE
  public setTaskAsArchived(
    tasks: TaskWithAssigneesInterface[],
    shouldArchive: boolean
  ): void {
    const updates = tasks
      .filter(task => !shouldArchive || this.canBeArchivedOrDeleted(task))
      .map(task => ({ id: task.id, changes: { archived: shouldArchive } }));

    this.store.dispatch(
      new TaskActions.StartArchiveTasks({
        tasks: updates,
        userId: this.authService.userId
      })
    );
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
  private getAssigneesByType(assignees: AssigneeInterface[]) {
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
    const tasksToRemove = tasks
      .filter(task => this.canBeArchivedOrDeleted(task))
      .map(task => task.id);
    this.store.dispatch(new TaskActions.DeleteTasks({ ids: tasksToRemove }));
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

  public updateTaskEduContent(
    taskEduContents: TaskEduContentInterface[],
    updatedValues: Partial<TaskEduContentInterface>
  ): void {
    throw new Error('Not implemented yet');
  }
}
