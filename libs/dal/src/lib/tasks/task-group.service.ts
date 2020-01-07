import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskGroupInterface } from '../+models';
import { TaskGroupServiceInterface } from './task-group.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskGroupService implements TaskGroupServiceInterface {
  constructor(private personApi: PersonApi) {}

  public getAllForUser(userId: number): Observable<TaskGroupInterface[]> {
    return this.personApi.getData(userId, 'taskGroups').pipe(
      map((res: { taskGroups: TaskGroupInterface[] }) =>
        res.taskGroups.map(taskGroup => ({
          ...taskGroup,
          end: new Date(taskGroup.end),
          start: new Date(taskGroup.start)
        }))
      )
    );
  }
}
