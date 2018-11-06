import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { ScormResultsServiceInterface } from './scorm-results.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormResultsService implements ScormResultsServiceInterface {
  constructor(private personApi: PersonApi) {}

  public getResultsForStudent(userId: number): Observable<Object> {
    return this.personApi.studentResultsExtendedForStudent(userId);
  }

  // werkt nog niet, unauthorised
  public getResultForTask(
    userId: number,
    taskId: number,
    eduContentId: number
  ): Observable<Object> {
    return this.personApi.resultForTask(userId, taskId, eduContentId);
  }

  // werkt nog niet, unauthorised
  public getResultForUnlockedContent(
    userId: number,
    unlockedContentId: number,
    eduContentId: number
  ): Observable<Object> {
    return this.personApi.resultForUnlockedContent(
      userId,
      unlockedContentId,
      eduContentId
    );
  }
}
