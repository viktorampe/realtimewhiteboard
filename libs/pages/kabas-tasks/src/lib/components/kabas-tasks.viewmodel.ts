import { Injectable } from '@angular/core';
import { DalState, TaskActions } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TaskStatusEnum,
  TaskWithAssigneesInterface
} from '../interfaces/TaskWithAssignees.interface';
import { getTasksWithAssignments } from './kabas-tasks.viewmodel.selectors';

@Injectable({
  providedIn: 'root'
})
export class KabasTasksViewModel {
  public tasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;
  public paperTasksWithAssignments$: Observable<TaskWithAssigneesInterface[]>;

  constructor(private store: Store<DalState>) {
    this.tasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, { isPaper: false }),
      map(tasks => tasks.map(task => ({ ...task, ...this.getTaskDates(task) })))
    );

    this.paperTasksWithAssignments$ = this.store.pipe(
      select(getTasksWithAssignments, { isPaper: true }),
      map(tasks => tasks.map(task => ({ ...task, ...this.getTaskDates(task) })))
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

  public setArchivedTasks(
    tasks: TaskWithAssigneesInterface[],
    isArchived: boolean
  ): void {
    const updates = tasks
      .filter(task => !isArchived || this.canBeArchivedOrDeleted(task))
      .map(task => ({ id: task.id, changes: { archived: isArchived } }));

    this.store.dispatch(new TaskActions.UpdateTasks({ tasks: updates }));
  }

  public removeTasks(tasks: TaskWithAssigneesInterface[]): void {
    const tasksToRemove = tasks
      .filter(task => this.canBeArchivedOrDeleted(task))
      .map(task => task.id);
    this.store.dispatch(new TaskActions.DeleteTasks({ ids: tasksToRemove }));
  }

  public toggleFavorite(task: TaskWithAssigneesInterface): void {}

  public canBeArchivedOrDeleted(task: TaskWithAssigneesInterface): boolean {
    return (
      task.isPaperTask ||
      task.status === TaskStatusEnum.FINISHED ||
      (!task.endDate && !task.startDate)
    );
  }
}
