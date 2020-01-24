import { Injectable } from '@angular/core';
import { PersonApi, TaskApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TaskClassGroupInterface,
  TaskEduContentInterface,
  TaskGroupInterface,
  TaskStudentInterface
} from '../+models';
import { TaskInterface } from './../+models/Task.interface';
import {
  TaskServiceInterface,
  UpdateTaskResultInterface
} from './task.service.interface';
@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskServiceInterface {
  constructor(private personApi: PersonApi, private taskApi: TaskApi) {}

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
    return this.taskApi.updateAccess(
      taskId,
      taskGroups,
      taskStudents,
      taskClassGroups
    ) as Observable<TaskInterface>;
  }

  printTask(taskId: number, withNames: boolean) {}
  printSolution(taskId: number) {}
}
