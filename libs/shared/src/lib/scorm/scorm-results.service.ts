import { Injectable } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CmiInterface } from './interfaces/cmi.interface';
import { ScormResultsServiceInterface } from './scorm-results.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ScormResultsService implements ScormResultsServiceInterface {
  constructor(private personApi: PersonApi) {}

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
    return this.personApi.resultForTask(userId, taskId, eduContentId).pipe(
      // TODO: handle error in effect
      catchError(err => {
        console.log(err.message);
        return of({});
      }),
      map(res => res as ResultInterface)
    );
  }

  /**
   * Checks the polpo-api if a result exists and returns it if it is in progress.
   * Creates a new result if it doesn't exist (or is completed) and returns it.
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
      .pipe(
        // TODO: handle error in effect
        catchError(err => {
          console.log(err.message);
          return of({});
        }),
        map(res => res as ResultInterface)
      );
  }

  /**
   *
   *
   * @param {number} userId
   * @param {number} resultId
   * @param {number} time
   * @param {string} status
   * @param {number} [score]
   * @param {*} [cmi]
   * @returns {Observable<Object>}
   * @memberof ScormResultsService
   */
  public saveResult(
    userId: number,
    resultId: number,
    cmi: CmiInterface
  ): Observable<ResultInterface> {
    const score = cmi.core.score.raw;
    const time = this.convertCmiTimeStringToNumber(cmi.core.total_time);
    const status = cmi.core.lesson_status;

    return this.personApi
      .saveResult(userId, resultId, score, time, status, cmi)
      .pipe(map(res => res as ResultInterface));
  }

  private convertCmiTimeStringToNumber(cmiTimeString: string): number {
    const timepieces = cmiTimeString.split(':');
    const timespan =
      // tslint:disable-next-line:radix
      parseInt(timepieces[0]) * 3600000 +
      // tslint:disable-next-line:radix
      parseInt(timepieces[1]) * 60000 +
      parseFloat(timepieces[2]) * 1000;

    return timespan;
  }
}
