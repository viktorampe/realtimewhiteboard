import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BulkUpdateResultInfoInterface } from '../+external-interfaces/bulk-update-result-info';
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

  updateTasks(
    userId: number,
    update: Partial<TaskInterface>[]
  ): Observable<
    BulkUpdateResultInfoInterface<TaskInterface, TaskActiveErrorInterface>
  >;

  createTask(userId: number, task: TaskInterface): Observable<TaskInterface>;

  deleteTasks(
    userId: number,
    taskIds: number[]
  ): Observable<
    BulkUpdateResultInfoInterface<TaskInterface, TaskActiveErrorInterface>
  >;

  updateAccess(
    userId: number,
    taskId: number,
    taskGroups: TaskGroupInterface[],
    taskStudents: TaskStudentInterface[],
    taskClassGroups?: TaskClassGroupInterface[]
  ): Observable<TaskInterface>;
  printTask(taskId: number, withNames: boolean);
  printSolution(taskId: number);
}

export interface TaskActiveErrorInterface {
  task: string;
  activeUntil: Date;
  user: string;
}
