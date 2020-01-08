import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TaskClassGroupInterface,
  TaskEduContentInterface,
  TaskGroupInterface,
  TaskInterface,
  TaskStudentInterface
} from '../+models';

export const TASK_SERVICE_TOKEN = new InjectionToken('TaskService');

export interface TaskServiceInterface {
  getAllForUser(userId: number): Observable<TaskInterface[]>;
  linkEduContent(
    taskId: number,
    eduContentId: number
  ): Observable<TaskEduContentInterface>;

  updateAccess(
    userId: number,
    taskId: number,
    taskGroups: TaskGroupInterface[],
    taskStudents: TaskStudentInterface[],
    taskClassGroups?: TaskClassGroupInterface[]
  ): Observable<TaskInterface>;
}
