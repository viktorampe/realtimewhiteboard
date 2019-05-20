import { Injectable } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { HistoryInterface } from '../+models';
import { HistoryServiceInterface } from './history.service.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements HistoryServiceInterface {
  constructor(private personApi: PersonApi) {}

  getAllForUser(userId: number): Observable<HistoryInterface[]> {
    return this.personApi.getHistory(userId);
  }

  addHistory(
    userId: number,
    history: HistoryInterface
  ): Observable<HistoryInterface> {
    return this.personApi.createHistory(userId, history);
  }

  deleteHistory(userId: number, historyId: number): Observable<boolean> {
    return this.personApi
      .destroyByIdHistory(userId, historyId)
      .pipe(mapTo(true));
  }
}
