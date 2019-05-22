import { Injectable } from '@angular/core';
import { HistoryApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HistoryInterface } from '../+models';
import { HistoryServiceInterface } from './history.service.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements HistoryServiceInterface {
  constructor(private personApi: PersonApi, private historyApi: HistoryApi) {}

  getAllForUser(userId: number): Observable<HistoryInterface[]> {
    return this.personApi.getHistory(userId);
  }

  upsertHistory(history: HistoryInterface): Observable<HistoryInterface> {
    return this.historyApi.upsertByInstance(
      history.name,
      history.type,
      history.learningAreaId,
      history.criteria || '',
      history.eduContentId || 0,
      history.bundleId || 0,
      history.taskId || 0
    );
  }

  deleteHistory(userId: number, historyId: number): Observable<boolean> {
    return this.personApi
      .destroyByIdHistory(userId, historyId)
      .pipe(mapTo(true));
  }
}
