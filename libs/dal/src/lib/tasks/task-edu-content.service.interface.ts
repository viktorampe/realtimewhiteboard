import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskEduContentInterface } from '../+models';

export const TASK_EDU_CONTENT_SERVICE_TOKEN = new InjectionToken(
  'TaskEduContentService'
);

export interface TaskEduContentServiceInterface {
  getAllForUser(userId: number): Observable<TaskEduContentInterface[]>;
  remove(taskEduContentId: number): Observable<boolean>;
  removeAll(taskEduContentIds: number[]): Observable<boolean>;
  updateTaskEduContents(
    userId: number,
    update: Partial<TaskEduContentInterface>[]
  ): Observable<TaskEduContentInterface[]>;
}
