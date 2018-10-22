import { Injectable } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { AlertQueueApi, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertApi: AlertQueueApi, private personApi: PersonApi) {}

  getAllAlertsForCurrentUser(
    userId: number
  ): Observable<AlertQueueInterface[]> {
    return this.personApi.getOwnsAlerts(userId);
  }

  getAlertsForCurrentUserByDate(
    userId: number,
    lastUpdateTime: Date
  ): Observable<AlertQueueInterface[]> {
    const dateFilter = { where: { sentAt: { gt: lastUpdateTime } } };
    return this.personApi.getOwnsAlerts(userId, dateFilter);
  }

  setAlertAsRead(alert: AlertQueueInterface): Observable<AlertQueueInterface> {
    if (!alert.read) {
      alert.read = true;
      return this.alertApi.patchAttributes(alert.id, alert);
    } else {
      return of(alert);
    }
  }
}
