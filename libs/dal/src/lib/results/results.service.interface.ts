import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultInterface } from '../+models';

export const RESULTS_SERVICE_TOKEN = new InjectionToken(
  'ResultsServiceInterface'
);

export interface ResultsServiceInterface {
  getAllForUser(userId: number): Observable<ResultInterface[]>;

  getResultForTask(
    userId: number,
    taskId: number,
    eduContentId: number
  ): Observable<ResultInterface>;

  getResultForUnlockedContent(
    userId: number,
    unlockedContentId: number,
    eduContentId: number
  ): Observable<ResultInterface>;

  saveResult(
    userId: number,
    result: ResultInterface
  ): Observable<ResultInterface>;

  getAllForUser(userId: number): Observable<ResultInterface[]>;
}
