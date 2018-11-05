import { Injectable } from '@angular/core';
import {
  PersonApi,
  TaskEduContentInterface
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { TaskEduContentsInterface } from './task-edu-contents.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskEduContentsService implements TaskEduContentsInterface {
  constructor(private api: PersonApi) {}

  getAllForUser(userId: number): Observable<TaskEduContentInterface[]> {
    return this.api.getTaskEduContents(userId);
  }
}
