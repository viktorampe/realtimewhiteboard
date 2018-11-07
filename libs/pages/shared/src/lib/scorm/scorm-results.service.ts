import { Injectable } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScormResultsServiceInterface } from './scorm-results.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormResultsService implements ScormResultsServiceInterface {
  constructor(private personApi: PersonApi) {}

  public getResultsForStudent(userId: number): Observable<Object> {
    return this.personApi.studentResultsExtendedForStudent(userId);
  }

  // werkt nog niet, GET verkeerd opgebouwd
  /**
   * Checks the polpo-api if a result exists and returns it if it is in progress.
   * Creates a new result if it doesn't exist and returns it.
   * Returns an error if a result is completed and the user isn't allowed to repeat it.
   *
   * @param {number} userId
   * @param {number} taskId
   * @param {number} eduContentId
   * @returns {Observable<ResultInterface>}
   * @memberof ScormResultsService
   */
  public getResultForTask(
    userId: number,
    taskId: number,
    eduContentId: number
  ): Observable<ResultInterface> {
    return this.personApi
      .resultForTask(userId, taskId, eduContentId)
      .pipe(map(res => res as ResultInterface));
  }

  // werkt nog niet, GET verkeerd opgebouwd
  /**
   * Checks the polpo-api if a result exists and returns it if it is in progress.
   * Creates a new result if it doesn't exist and returns it.
   * Returns an error if a result is completed and the user isn't allowed to repeat it.
   *
   * @param {number} userId
   * @param {number} unlockedContentId
   * @param {number} eduContentId
   * @returns {Observable<ResultInterface>}
   * @memberof ScormResultsService
   */
  public getResultForUnlockedContent(
    userId: number,
    unlockedContentId: number,
    eduContentId: number
  ): Observable<ResultInterface> {
    return this.personApi
      .resultForUnlockedContent(userId, unlockedContentId, eduContentId)
      .pipe(map(res => res as ResultInterface));
  }

  // werkt nog niet, POST verkeerd opgebouwd
  /**
   *
   *
   * @param {number} userId
   * @param {number} resultId
   * @param {number} time
   * @param {string} status 'incomplete' | 'completed'
   * @param {number} [score]
   * @param {*} [cmi]
   * @returns {Observable<Object>}
   * @memberof ScormResultsService
   */
  public saveResult(
    userId: number,
    resultId: number,
    time: number,
    status: string,
    score?: number,
    cmi?: any
  ): Observable<Object> {
    return this.personApi.saveResult(
      userId,
      resultId,
      score,
      time,
      status,
      cmi
    );
  }
}
