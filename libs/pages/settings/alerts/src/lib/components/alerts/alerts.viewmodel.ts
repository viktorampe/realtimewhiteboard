import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AlertQueueInterface,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsViewModel {
  public alerts$: Observable<AlertQueueInterface[]>;

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
        intended: true,
        customFeedbackHandlers: {
          useCustomSuccessHandler: true,
          useCustomErrorHandler: false
        }
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
    this.alerts$ = this.store.pipe(select(AlertQueries.getAll));
  }
}
