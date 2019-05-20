import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryInterface } from '../+models';

export const HISTORY_SERVICE_TOKEN = new InjectionToken('HistoryService');

export interface HistoryServiceInterface {
  getAllForUser(userId: number): Observable<HistoryInterface[]>;
  addHistory(
    userId: number,
    history: HistoryInterface
  ): Observable<HistoryInterface>;
  deleteHistory(userId: number, historyId: number): Observable<boolean>;
}
