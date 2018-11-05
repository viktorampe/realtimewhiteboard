import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskInterface } from '../+models';
import { TaskServiceInterface } from './task.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<TaskInterface[]> {
    return this.personApi
      .getData(userId, 'tasks')
      .pipe(map((res: { tasks: TaskInterface[] }) => res.tasks));
  }
}
