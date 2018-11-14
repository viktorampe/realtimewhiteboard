import { InjectionToken } from '@angular/core';
import { ResultInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { CmiInterface } from './interfaces/cmi.interface';
import { ResultAreasInterface } from './interfaces/resultAreas.interface';

export const SCORM_RESULTS_SERVICE_TOKEN = new InjectionToken(
  'ScormResultsServiceInterface'
);

export interface ScormResultsServiceInterface {
  getResultsForStudent(userId: number): Observable<ResultAreasInterface>;

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
