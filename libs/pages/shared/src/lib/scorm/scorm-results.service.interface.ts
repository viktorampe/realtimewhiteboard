import { ResultInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export interface ScormResultsServiceInterface {
  getResultsForStudent(userId: number): Observable<Object>;

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
    time: number,
    status: string,
    score?: number,
    cmi?: any
  ): Observable<Object>;
}
