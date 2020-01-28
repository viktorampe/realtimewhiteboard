import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { PersonApi, TaskApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TaskClassGroupInterface,
  TaskEduContentInterface,
  TaskGroupInterface,
  TaskStudentInterface
} from '../+models';
import { DalOptions, DAL_OPTIONS } from '../../lib/dal.module';
import { TaskInterface } from './../+models/Task.interface';
import {
  TaskServiceInterface,
  UpdateTaskResultInterface
} from './task.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskServiceInterface {
  constructor(
    private personApi: PersonApi,
    private taskApi: TaskApi,
    @Inject(DAL_OPTIONS) private dalOptions: DalOptions,
    @Inject(WINDOW) private window: Window
  ) {}

  getAllForUser(userId: number): Observable<TaskInterface[]> {
    return this.personApi
      .getData(userId, 'tasks')
      .pipe(map((res: { tasks: TaskInterface[] }) => res.tasks));
  }

  linkEduContent(
    taskId: number,
    eduContentId: number
  ): Observable<TaskEduContentInterface> {
    return this.taskApi.linkEduContents(taskId, eduContentId);
  }

  updateTasks(
    userId: number,
    update: Partial<TaskInterface>[]
  ): Observable<UpdateTaskResultInterface> {
    return this.taskApi.updateTasks(update) as Observable<
      UpdateTaskResultInterface
    >;
  }

  createTask(userId: number, task: TaskInterface): Observable<TaskInterface> {
    return this.personApi.createTeacherTasks(userId, task) as Observable<
      TaskInterface
    >;
  }

  deleteTasks(
    userId: number,
    taskIds: number[]
  ): Observable<UpdateTaskResultInterface> {
    return this.taskApi.destroyTasks(taskIds) as Observable<
      UpdateTaskResultInterface
    >;
  }

  updateAccess(
    userId: number,
    taskId: number,
    taskGroups: TaskGroupInterface[],
    taskStudents: TaskStudentInterface[],
    taskClassGroups?: TaskClassGroupInterface[]
  ): Observable<TaskInterface> {
    return this.taskApi
      .updateAccess(taskId, taskGroups, taskStudents, taskClassGroups)
      .pipe(
        map(
          (task: TaskInterface): TaskInterface => ({
            ...task,
            taskClassGroups: task.taskClassGroups.map(tCG =>
              castStartEndToDate(tCG)
            ),
            taskGroups: task.taskGroups.map(tG => castStartEndToDate(tG)),
            taskStudents: task.taskStudents.map(tS => castStartEndToDate(tS))
          })
        )
      );
  }

  printTask(taskId: number, withNames: boolean) {
    const { apiBaseUrl } = this.dalOptions;
    this.window.open(
      `${apiBaseUrl}/api/tasks/paper-task-pdf?taskId=${taskId}&withNames=${withNames}`
    );
  }
  printSolution(taskId: number) {
    const { apiBaseUrl } = this.dalOptions;
    this.window.open(
      `${apiBaseUrl}/api/tasks/paper-task-solution-pdf?taskId=${taskId}`
    );
  }
}

function castStartEndToDate<
  T extends TaskClassGroupInterface | TaskGroupInterface | TaskStudentInterface
>(assignee: T): T {
  return {
    ...assignee,
    start: assignee.start ? new Date(assignee.start) : undefined,
    end: assignee.end ? new Date(assignee.end) : undefined
  };
}
