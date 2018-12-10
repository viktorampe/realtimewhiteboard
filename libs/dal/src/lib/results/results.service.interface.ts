import { InjectionToken } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { ScormCmiInterface } from '@campus/scorm';
import { Observable } from 'rxjs';

export const RESULTS_SERVICE_TOKEN = new InjectionToken(
  'ResultsServiceInterface'
);

export interface ResultsServiceInterface {
  //TODO the model of the resultsInterface might need to be updated once the api call changes have been done, see issue https://github.com/diekeure/polpo-api/issues/670
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
    resultId: number,
    cmi: ScormCmiInterface
  ): Observable<ResultInterface>;
}
