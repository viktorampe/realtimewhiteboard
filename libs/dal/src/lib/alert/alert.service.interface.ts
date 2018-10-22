import { InjectionToken } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export const ALERT_SERVICE_TOKEN = new InjectionToken('AlertService');
export interface AlertServiceInterface {
  getAllAlertsForCurrentUser(userId: number): Observable<AlertQueueInterface[]>;

  getAlertsForCurrentUserByDate(
    userId: number,
    lastUpdateTime: Date
  ): Observable<AlertQueueInterface[]>;

  setAlertAsRead(alert: AlertQueueInterface);
}
