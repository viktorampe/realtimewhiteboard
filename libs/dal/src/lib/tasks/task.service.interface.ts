import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskEduContentInterface, TaskInterface } from '../+models';

export const TASK_SERVICE_TOKEN = new InjectionToken('TaskService');

export interface TaskServiceInterface {
  getAllForUser(userId: number): Observable<TaskInterface[]>;
  linkEduContent(
    taskId: number,
    eduContentId: number
  ): Observable<TaskEduContentInterface>;

  updateTasks(
    userId: number,
    update: Partial<TaskInterface>[]
  ): Observable<TaskUpdateInfoInterface>;

  createTask(userId: number, task: TaskInterface): Observable<TaskInterface>;

  deleteTasks(
    userId: number,
    taskIds: number[]
  ): Observable<TaskUpdateInfoInterface>;
}
