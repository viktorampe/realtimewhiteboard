import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskEduContentInterface } from '../+models';

export const TASK_EDU_CONTENT_SERVICE_TOKEN = new InjectionToken(
  'TaskEduContentsService'
);

export interface TaskEduContentsInterface {
  getAllForUser(userId: number): Observable<TaskEduContentInterface[]>;
}
