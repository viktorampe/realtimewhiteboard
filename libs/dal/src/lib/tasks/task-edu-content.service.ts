import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskEduContentInterface } from '../+models';
import { TaskEduContentServiceInterface } from './task-edu-content.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskEduContentService implements TaskEduContentServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<TaskEduContentInterface[]> {
    return this.personApi
      .getData(userId, 'taskEduContents')
      .pipe(
        map(
          (res: { taskEduContents: TaskEduContentInterface[] }) =>
            res.taskEduContents
        )
      );
  }
}
