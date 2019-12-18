import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskClassGroupInterface } from '../+models';

@Injectable({
  providedIn: 'root'
})
export class TaskClassGroupService {
  constructor(private personApi: PersonApi) {}

  public getAllForUser(userId: number): Observable<TaskClassGroupInterface[]> {
    return this.personApi.getData(userId, 'taskClassGroups').pipe(
      map((res: { taskClassGroups: TaskClassGroupInterface[] }) =>
        res.taskClassGroups.map(taskClassGroup => ({
          ...taskClassGroup,
          end: new Date(taskClassGroup.end),
          start: new Date(taskClassGroup.start)
        }))
      )
    );
  }
}
