import { InjectionToken } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { CmiInterface } from './interfaces/cmi.interface';

export const RESULTS_SERVICE_TOKEN = new InjectionToken(
  'ResultsServiceInterface'
);

export interface ResultsServiceInterface {
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
    resultId: number,
    cmi: CmiInterface
  ): Observable<ResultInterface>;
}
