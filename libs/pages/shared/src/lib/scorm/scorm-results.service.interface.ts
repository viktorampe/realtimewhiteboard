import { Observable } from 'rxjs';

export interface ScormResultsServiceInterface {
  getResultsForStudent(userId: number): Observable<Object>;

  getResultForUnlockedContent(
    userId: number,
    unlockedContentId: number,
    eduContentId: number
  ): Observable<Object>;
}
