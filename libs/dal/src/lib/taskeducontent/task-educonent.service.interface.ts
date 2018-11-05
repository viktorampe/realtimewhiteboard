import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskEduContentInterface } from '../+models';

export const STUDENT_CONTENT_STATUS_SERVICE_TOKEN = new InjectionToken(
  'TaskEducontentService'
);

export interface TaskEducontentServiceInterface {
  getAllForUser(userId: number): Observable<TaskEduContentInterface[]>;
}
