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
}

export interface TaskUpdateInfoInterface {
  tasks: Partial<TaskInterface>[];
  errors: {
    task: string;
    activeUntil: Date;
    user: string;
  }[];
}
