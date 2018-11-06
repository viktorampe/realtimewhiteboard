import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskInstanceInterface } from '../+models';
import { TaskInstanceServiceInterface } from './task-instance.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskInstanceService implements TaskInstanceServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<TaskInstanceInterface[]> {
    return this.personApi
      .getData(userId, 'taskInstances')
      .pipe(
        map(
          (res: { taskInstances: TaskInstanceInterface[] }) => res.taskInstances
        )
      );
  }
}
