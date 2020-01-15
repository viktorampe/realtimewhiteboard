import { Injectable } from '@angular/core';
import {
  DalState,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  TaskActions,
  TaskInterface,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  AssigneeInterface,
  AssigneeTypesEnum
} from '../interfaces/Assignee.interface';
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

  public setTaskAsArchived(
    tasks: TaskWithAssigneesInterface[],
    shouldArchive: boolean
  ): void {
    const updates = tasks
      .filter(task => !shouldArchive || this.canArchive(task))
      .map(task => ({ id: task.id, changes: { archived: shouldArchive } }));

    this.store
      .pipe(select(UserQueries.getCurrentUser), take(1))
      .subscribe(user =>
        this.store.dispatch(
          new TaskActions.StartArchiveTasks({
            tasks: updates,
            userId: user.id
          })
        )
      );
  }

  public updateTask(task: TaskInterface, assignees: AssigneeInterface[]) {
    this.store
      .pipe(select(UserQueries.getCurrentUser), take(1))
      .subscribe(user => {
        this.store.dispatch(
          new TaskActions.UpdateTask({
            task: { id: task.id, changes: task }
            //userId: user.id
          })
        );
        this.store.dispatch(
          new TaskActions.UpdateAccess({
            userId: user.id,
            taskId: task.id,
            taskGroups: assignees.filter(
              assignee => assignee.type === AssigneeTypesEnum.CLASSGROUP
            ),
            taskStudents: assignees.filter(
              assignee => assignee.type === AssigneeTypesEnum.STUDENT
            ),
            taskClassGroups: assignees.filter(
              assignee => assignee.type === AssigneeTypesEnum.CLASSGROUP
            )
          })
        );
      });
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

  public createTask(
    name: string,
    learningAreaId: number,
    type: 'paper' | 'digital'
  ): void {
    this.store
      .pipe(select(UserQueries.getCurrentUser), take(1))
      .subscribe(user =>
        this.store.dispatch(
          new TaskActions.StartAddTask({
            task: { name, learningAreaId, isPaperTask: type === 'paper' },
            navigateAfterCreate: true,
            userId: user.id
          })
        )
      );
  }
}
