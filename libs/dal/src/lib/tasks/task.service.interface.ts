import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskInterface } from '../+models';

export const TASK_SERVICE_TOKEN = new InjectionToken('TaskService');

export interface TaskServiceInterface {
  getAllForUser(userId: number): Observable<TaskInterface[]>;
}
