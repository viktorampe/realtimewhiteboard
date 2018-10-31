import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { interval, Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { DalActions } from '..';
import {
  AlertServiceInterface,
  ALERT_SERVICE_TOKEN
} from '../../alert/alert.service.interface';
import { ActionSuccessful } from './../dal.actions';
import { DalState } from './../dal.state.interface';
import {
  AlertsActionTypes,
  AlertsLoaded,
  AlertsLoadError,
  LoadAlerts,
  LoadNewAlerts,
  NewAlertsLoaded,
  SetReadAlert,
  StartPollAlerts
} from './alert.actions';

const MINIMUM_POLLING_INTERVAL = 3000;

@Injectable()
export class AlertsEffects {
  // Timer singleton
  private pollingTimer$: Observable<LoadNewAlerts>;
  // finishes the Timer
  private stopTimer$: Subject<void> = new Subject();

  @Effect()
  startpollAlerts$ = this.actions.pipe(
    ofType(AlertsActionTypes.StartPollAlerts),
    switchMap(action => this.getNewTimer(<StartPollAlerts>action))
  );

  // stops the current polling and completes stopTimer$
  // for use in onDestroy
  // if a new polling is started, it wil be <dramatic pauze> unstoppable!
  @Effect()
  stopPollAlerts$ = this.actions.pipe(
    ofType(AlertsActionTypes.StopPollAlerts),
    tap(_ => this.stopTimer()),
    map(
      _ =>
        new DalActions.ActionSuccessful({
          successfulAction: 'polling stopped'
        })
    )
  );

  @Effect()
  loadAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadAlerts, {
    run: (action: LoadAlerts, state: DalState) => {
      if (!action.payload.force && state.alerts.loaded) return;

      const userId = action.payload.userId;

      // If not provided, set update time to now
      const timeStamp = action.payload.timeStamp || Date.now();

      return this.alertService
        .getAllForUser(userId)
        .pipe(map(alerts => new AlertsLoaded({ alerts, timeStamp })));
    },
    onError: (action: LoadAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  @Effect()
  loadNewAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadNewAlerts, {
    run: (action: LoadNewAlerts, state: DalState) => {
      if (!state.alerts.loaded)
        return new LoadAlerts({ userId: action.payload.userId });

      // If not provided, set update time to now
      const timeStamp = action.payload.timeStamp || Date.now();

      return this.alertService
        .getAllForUser(action.payload.userId, timeStamp)
        .pipe(map(alerts => new NewAlertsLoaded({ alerts, timeStamp })));
    },
    onError: (action: LoadNewAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  @Effect()
  setReadAlert$ = this.dataPersistence.optimisticUpdate(
    AlertsActionTypes.SetReadAlert,
    {
      run: (action: SetReadAlert, state: DalState) => {
        if (!state.alerts.loaded)
          return new LoadAlerts({ userId: action.payload.personId });

        return this.alertService
          .setAlertAsRead(
            action.payload.personId,
            action.payload.alertIds,
            action.payload.read,
            action.payload.intended
          )
          .pipe(
            map(
              affectedRows =>
                new ActionSuccessful({
                  successfulAction: 'alert updated'
                })
            )
          );
      },
      undoAction: (action: SetReadAlert, state: any) => {
        return new AlertsLoadError(new Error('Unable to update alert'));
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(ALERT_SERVICE_TOKEN) private alertService: AlertServiceInterface
  ) {}

  private getNewTimer(startPollAction: StartPollAlerts) {
    this.stopTimer$.next(); // Complete current timer

    const timerInterval = Math.max(
      startPollAction.payload.pollingInterval,
      MINIMUM_POLLING_INTERVAL
    );

    this.pollingTimer$ = interval(timerInterval).pipe(
      takeUntil(this.stopTimer$.pipe(take(1))),
      map(
        values => new LoadNewAlerts({ userId: startPollAction.payload.userId })
      )
    );

    return this.pollingTimer$;
  }

  private stopTimer() {
    this.stopTimer$.next(); // Complete current timer
    this.stopTimer$.complete();
  }
}
