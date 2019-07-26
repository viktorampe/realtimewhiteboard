import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertQueueInterface } from '../+models';

export const ALERT_SERVICE_TOKEN = new InjectionToken('AlertService');
export interface AlertServiceInterface {
  getAllForUser(
    userId: number,
    lastUpdateTime?: number
  ): Observable<AlertQueueInterface[]>;

  setAlertAsRead(
    userId: number,
    alertId: number | number[],
    read?: boolean,
    intended?: boolean
  );

  deleteAlert(userId: number, alertId: number): Observable<any>;
}
