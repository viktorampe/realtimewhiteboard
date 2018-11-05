import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { TaskEduContentInterface } from '../+models';
import { TaskEducontentServiceInterface } from './task-educonent.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskEducontentService implements TaskEducontentServiceInterface {
  constructor(private api: PersonApi) {}

  getAllForUser(userId: number): Observable<TaskEduContentInterface[]> {
    return this.api.getTaskEduContents(userId);
  }
}
