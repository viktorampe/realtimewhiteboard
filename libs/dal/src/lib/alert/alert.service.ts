import { Injectable } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { AlertServiceInterface } from './alert.service.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertService implements AlertServiceInterface {
  constructor(private personApi: PersonApi) {}

  /**
   * Returns an array of all alerts for the specified user in an Observable.
   *
   * @param {number} userId The recipientId to find by.
   * @param {Date} lastUpdateTime (Optional) Return alerts with a validFrom greater than this.
   * @returns {Observable<AlertQueueInterface[]>}
   * @memberof AlertService
   */
  getAllForUser(
    userId: number,
    lastUpdateTime?: number
  ): Observable<AlertQueueInterface[]> {
    let dateFilter = {};
    if (lastUpdateTime) {
      const dateString = new Date(lastUpdateTime).toISOString();
      dateFilter = { where: { validFrom: { gt: dateString } } };
    }

    return this.personApi.getAlertQueues(userId, dateFilter);
  }

  /**
   * Sets the alert(s) as read. Returns the number of affected records.
   *
   * @param {number} userId
   * @param {(number | number[])} alertId
   * @param {read} (Optional) The read status to set (default: true).
   * @param {intended} (Optional) The intended status to set (default: true). Represents if the read status is set by a user interaction.
   * @returns {Observable<object>}  An object with the count of the affected records in an Observable.
   * @memberof AlertService
   */
  setAlertAsRead(
    userId: number,
    alertId: number | number[],
    read = true,
    intended = true
  ): Observable<object> {
    return this.personApi.setAlertRead(userId, alertId, read, intended);
  }
}
