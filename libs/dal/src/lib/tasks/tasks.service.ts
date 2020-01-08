import { Injectable } from '@angular/core';
import { PersonApi, TaskApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskEduContentInterface, TaskInterface } from '../+models';
import { TaskServiceInterface } from './task.service.interface';
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
  ): Observable<TaskInterface[]> {
    throw new Error('Method not implemented.');
  }

  createTask(userId: number, task: TaskInterface): Observable<TaskInterface> {
    throw new Error('Method not implemented.');
  }

  deleteTasks(userId: number, taskIds: number[]) {
    throw new Error('Method not implemented.');
  }
}
