import { Inject, Injectable } from '@angular/core';
import { AlertQueueInterface } from '@campus/dal';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map, tap } from 'rxjs/operators';
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
  SetReadAlerts
} from './alert.actions';

@Injectable()
export class AlertsEffects {
  @Effect()
  loadAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadAlerts, {
    run: (action: LoadAlerts, state: DalState) => {
      if (!action.payload.force && state.alerts.loaded) return;
      const timeStamp = action.payload.timeStamp
        ? action.payload.timeStamp
        : new Date();

      return this.alertService
        .getAllForUser(action.payload.userId)
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

      const timeStamp = action.payload.timeStamp
        ? action.payload.timeStamp
        : new Date();
      const updateTimeDeltaInMilliseconds =
        (<Date>state.alerts.lastUpdateTimeStamp).getTime() -
        timeStamp.getTime();
      if (!action.payload.force && updateTimeDeltaInMilliseconds < 3000) return;

      return this.alertService
        .getAllForUser(action.payload.userId, timeStamp)
        .pipe(
          tap(alerts => this.checkAlertsForTasks(alerts)),
          map(alerts => new NewAlertsLoaded({ alerts, timeStamp }))
        );
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
        if (!state.alerts.loaded) return;

        return this.alertService
          .setAlertAsRead(
            action.payload.personId,
            action.payload.alertId,
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

  @Effect()
  setReadAlerts$ = this.dataPersistence.optimisticUpdate(
    AlertsActionTypes.SetReadAlerts,
    {
      run: (action: SetReadAlerts, state: any) => {
        if (!state.alerts.loaded) return;

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
                  successfulAction: 'alerts updated'
                })
            )
          );
      },
      undoAction: (action: SetReadAlerts, state: any) => {
        return new AlertsLoadError(new Error('Unable to update alerts'));
      }
    }
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<DalState>,
    @Inject(ALERT_SERVICE_TOKEN) private alertService: AlertServiceInterface
  ) {}

  private checkAlertsForTasks(alertArray: AlertQueueInterface[]) {
    if (alertArray.filter(alert => alert.taskId)) {
      // TODO: Dispatch LOAD_TASKS action
      // this.dataPersistence.store.dispatch();
      console.log('Load tasks now!');
    }
  }
}
