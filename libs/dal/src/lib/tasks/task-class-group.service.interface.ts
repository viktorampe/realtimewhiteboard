import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskClassGroupInterface } from '../+models';

export const TASK_CLASS_GROUP_SERVICE_TOKEN = new InjectionToken(
  'TaskClassGroupService'
);

export interface TaskClassGroupServiceInterface {
  getAllForUser(userId: number): Observable<TaskClassGroupInterface[]>;
}
