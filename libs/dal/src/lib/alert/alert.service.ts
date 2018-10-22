import { Injectable } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { AlertQueueApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertApi: AlertQueueApi, private personApi: PersonApi) {}

  getAllAlertsForCurrentUser(
    userId: number
  ): Observable<AlertQueueInterface[]> {
    return this.personApi.getAlertQueues(userId);
  }

  getAlertsForCurrentUserByDate(
    userId: number,
    lastUpdateTime: Date
  ): Observable<AlertQueueInterface[]> {
    const dateString = lastUpdateTime.toISOString();
    const dateFilter = { where: { sentAt: { gt: dateString } } };
    return this.personApi.getAlertQueues(userId, dateFilter);
  }

  setAlertAsRead(userId: number, alertId: number): Observable<object> {
    return this.personApi.setAlertRead(userId, alertId, true, true);
  }
}
