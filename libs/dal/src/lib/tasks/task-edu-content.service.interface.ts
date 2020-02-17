import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BulkUpdateResultInfoInterface } from '../+external-interfaces/bulk-update-result-info';
import { TaskEduContentInterface } from '../+models';
import { TaskActiveErrorInterface } from './task.service.interface';

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
  ): Observable<UpdateTaskEduContentResultInterface>;
  deleteTaskEduContents(userId: number, taskEduContentIds: number[]);
  createTaskEduContent(
    userId: number,
    taskEduContents: Partial<TaskEduContentInterface>[]
  );
}

export interface UpdateTaskEduContentResultInterface
  extends BulkUpdateResultInfoInterface<
    TaskEduContentInterface,
    TaskActiveErrorInterface
  > {}
