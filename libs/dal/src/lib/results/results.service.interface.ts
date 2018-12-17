import { InjectionToken } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { Observable } from 'rxjs';

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
