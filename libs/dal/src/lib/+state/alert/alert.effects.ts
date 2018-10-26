import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
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
  PollAlerts,
  SetReadAlert
} from './alert.actions';

@Injectable()
export class AlertsEffects {
  @Effect()
  loadAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadAlerts, {
    run: (action: LoadAlerts, state: DalState) => {
      if (!action.payload.force && state.alerts.loaded) return;

      const userId = action.payload.userId;

      // If not provided, set update time to now
      const timeStamp = action.payload.timeStamp
        ? action.payload.timeStamp
        : Date.now();

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
      if (!state.alerts.loaded) return;

      // Minimum time between Api calls
      const requiredTimeDeltaInMilliseconds = 3000;

      // If not provided, set update time to now
      const timeStamp = action.payload.timeStamp
        ? action.payload.timeStamp
        : Date.now();

      const lastUpdateTimeStamp = state.alerts.lastUpdateTimeStamp;

      const updateTimeDeltaInMilliseconds = timeStamp - lastUpdateTimeStamp;

      if (
        !(
          action.payload.force ||
          updateTimeDeltaInMilliseconds > requiredTimeDeltaInMilliseconds
        )
      )
        return;

      return this.alertService
        .getAllForUser(action.payload.userId, timeStamp)
        .pipe(map(alerts => new NewAlertsLoaded({ alerts, timeStamp })));
    },
    onError: (action: LoadNewAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  @Effect()
  pollAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.PollAlerts, {
    run: (action: PollAlerts, state: DalState) => {
      return interval(action.payload.pollingInterval).pipe(
        map(values => new LoadNewAlerts({ userId: action.payload.userId }))
      );
    },
    onError: (action: PollAlerts, error) => {
      return error;
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
}
