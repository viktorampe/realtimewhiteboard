import { Injectable } from '@angular/core';
import {
  DalState,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  getRouterState,
  LearningAreaInterface,
  RouterStateUrl,
  TaskActions
} from '@campus/dal';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
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

  constructor(private store: Store<DalState>) {
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

  public setTaskAsArchived(
    tasks: TaskWithAssigneesInterface[],
    shouldArchive: boolean
  ): void {
    const updates = tasks
      .filter(task => !shouldArchive || this.canArchive(task))
      .map(task => ({ id: task.id, changes: { archived: shouldArchive } }));

    this.store.dispatch(new TaskActions.UpdateTasks({ tasks: updates }));
  }

  public removeTasks(tasks: TaskWithAssigneesInterface[]): void {}

  public toggleFavorite(task: TaskWithAssigneesInterface): void {
    const favorite: FavoriteInterface = {
      created: new Date(),
      name: task.name,
      taskId: task.id,
      type: FavoriteTypesEnum.TASK
    };
    this.store.dispatch(new FavoriteActions.ToggleFavorite({ favorite }));
  }

  public canArchive(task: TaskWithAssigneesInterface): boolean {
    return task.isPaperTask || task.status === TaskStatusEnum.FINISHED;
  }
}
