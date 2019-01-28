import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState
} from '@campus/dal';
import { NotificationItemInterface } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertsViewModel {
  public alerts$: Observable<NotificationItemInterface[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    this.setPresentationStreams();
  }

  public setAlertAsRead(alertId: number): void {
    this.store.dispatch(
      new AlertActions.SetReadAlert({
        alertIds: alertId,
        personId: this.authService.userId,
        read: true,
        intended: true
      })
    );
  }

  public setAlertAsUnread(alertId: number): void {
    this.store.dispatch(
      new AlertActions.SetReadAlert({
        alertIds: alertId,
        personId: this.authService.userId,
        read: false,
        intended: true
      })
    );
  }

  public removeAlert(alertId: number): void {
    this.store.dispatch(
      new AlertActions.DeleteAlert({
        id: alertId,
        personId: this.authService.userId
      })
    );
  }

  private setPresentationStreams(): void {
    this.alerts$ = this.store.pipe(
      select(AlertQueries.getAll),
      map(alerts => {
        return alerts //TODO -- this map is implemented twice and needs to be moved!!! see https://github.com/diekeure/campus/issues/510
          .filter(alert => alert.type !== 'message')
          .map(alert => {
            const notification: NotificationItemInterface = {
              icon: alert.type,
              titleText: alert.title,
              link: alert.link, // TODO: check the link format (external or internal)
              notificationText: alert.message,
              notificationDate: new Date(alert.sentAt)
            };
            console.log({ notification });
            return notification;
          });
      }),
      shareReplay(1)
    );
  }
}
