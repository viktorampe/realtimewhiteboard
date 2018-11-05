import { Injectable } from '@angular/core';
import { TaskEduContentApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { TaskEduContentInterface } from '../+models';
import { TaskEducontentServiceInterface } from './task-educonent.service.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskEducontentService implements TaskEducontentServiceInterface {
  constructor(private api: TaskEduContentApi) {}

  getAllForUser(userId: number): Observable<TaskEduContentInterface[]> {
    return null;
  }
}
