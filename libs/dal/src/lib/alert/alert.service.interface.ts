import { InjectionToken } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { Observable } from 'rxjs';

export const ALERT_SERVICE_TOKEN = new InjectionToken('AlertService');
export interface AlertServiceInterface {
  getAllForUser(
    userId: number,
    lastUpdateTime?: Date
  ): Observable<AlertQueueInterface[]>;

  setAlertAsRead(
    userId: number,
    alertId: number | number[],
    read?: boolean,
    intended?: boolean
  );
}
