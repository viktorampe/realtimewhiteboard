import { Injectable } from '@angular/core';
import { PersonApi, TaskApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskEduContentInterface } from '../+models';
import { TaskInterface } from './../+models/Task.interface';
import {
  TaskServiceInterface,
  TaskUpdateInfoInterface
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
  ): Observable<TaskUpdateInfoInterface> {
    return this.taskApi
      .updateTasks(update)
      .pipe(map(response => response as TaskUpdateInfoInterface));
  }

  createTask(userId: number, task: TaskInterface): Observable<TaskInterface> {
    throw new Error('Method not implemented.');
  }

  deleteTasks(
    userId: number,
    taskIds: number[]
  ): Observable<TaskUpdateInfoInterface> {
    return this.taskApi
      .destroyTasks(taskIds)
      .pipe(map(response => response as TaskUpdateInfoInterface));
  }
}
