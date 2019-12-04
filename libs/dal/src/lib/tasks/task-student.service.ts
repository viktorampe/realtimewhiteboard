import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskStudentInterface } from '../+models';
import { TaskStudentServiceInterface } from './task-student.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskStudentService implements TaskStudentServiceInterface {
  constructor(private personApi: PersonApi) {}

  public getAllForUser(userId: number): Observable<TaskStudentInterface[]> {
    return this.personApi
      .getData(userId, 'taskStudents')
      .pipe(
        map((res: { taskStudents: TaskStudentInterface[] }) => res.taskStudents)
      );
  }
}
