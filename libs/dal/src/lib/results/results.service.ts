import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultInterface } from '../+models';
import { ResultsServiceInterface } from './results.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ResultsService implements ResultsServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<ResultInterface[]> {
    return this.personApi
      .getData(userId, 'results')
      .pipe(map((res: { results: ResultInterface[] }) => res.results));
  }

  /**
   * Checks the polpo-api if a result exists and returns it if it is in progress.
   * Creates a new result if it doesn't exist and returns it.
   * Returns an error if a result is completed and the user isn't allowed to repeat it.
   *
   * @param {number} userId
   * @param {number} taskId
   * @param {number} eduContentId
   * @returns {Observable<ResultInterface>}
   * @memberof ResultsService
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
      .pipe(map(res => res as ResultInterface));
  }

  /**
   * Saves a result to the Api, returns the saved result
   */
  public saveResult(
    userId: number,
    result: ResultInterface
  ): Observable<ResultInterface> {
    return this.personApi
      .saveResult(
        userId,
        result.id,
        result.score,
        result.time,
        result.status,
        result.cmi
      )
      .pipe(map(res => res as ResultInterface));
  }
}
