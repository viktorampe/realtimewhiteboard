import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskStudentInterface } from '../+models';
export const TASK_STUDENT_SERVICE_TOKEN = new InjectionToken(
  'TaskStudentService'
);

export interface TaskStudentServiceInterface {
  getAllForUser(userId: number): Observable<TaskStudentInterface[]>;
}
