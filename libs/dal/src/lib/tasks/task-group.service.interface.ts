import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskGroupInterface } from '../+models';
export const TASK_GROUP_SERVICE_TOKEN = new InjectionToken('TaskGroupService');

export interface TaskGroupServiceInterface {
  getAllForUser(userId: number): Observable<TaskGroupInterface[]>;
}
