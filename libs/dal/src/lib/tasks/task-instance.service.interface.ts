import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskInstanceInterface } from '../+models';

export const TASK_INSTANCE_SERVICE_TOKEN = new InjectionToken(
  'TaskInstanceService'
);

export interface TaskInstanceServiceInterface {
  getAllForUser(userId: number): Observable<TaskInstanceInterface[]>;
}
