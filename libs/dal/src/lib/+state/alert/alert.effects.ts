import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  AlertServiceInterface,
  ALERT_SERVICE_TOKEN
} from '../../alert/alert.service.interface';
import {
  AlertsActionTypes,
  AlertsLoaded,
  AlertsLoadError,
  LoadAlerts,
  LoadNewAlerts,
  NewAlertsLoaded
} from './alert.actions';
import { State } from './alert.reducer';

@Injectable()
export class AlertsEffects {
  @Effect()
  loadAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadAlerts, {
    run: (action: LoadAlerts, state: any) => {
      if (!action.payload.force && state.alerts.loaded) return;
      return this.alertService
        .getAllAlertsForCurrentUser(action.payload.userId)
        .pipe(map(alerts => new AlertsLoaded({ alerts })));
    },
    onError: (action: LoadAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  @Effect()
  loadNewAlerts$ = this.dataPersistence.fetch(AlertsActionTypes.LoadNewAlerts, {
    run: (action: LoadNewAlerts, state: any) => {
      if (!state.alerts.loaded) return;

      const timeStamp = action.payload.timeStamp;
      const updateTimeDeltaInMilliseconds =
        (<Date>state.alerts.lastUpdateTimeStamp).getTime() -
        timeStamp.getTime();
      if (!action.payload.force && updateTimeDeltaInMilliseconds < 3000) return;

      return this.alertService
        .getAllAlertsForCurrentUser(action.payload.userId, timeStamp)
        .pipe(map(alerts => new NewAlertsLoaded({ alerts, timeStamp })));
    },
    onError: (action: LoadNewAlerts, error) => {
      return new AlertsLoadError(error);
    }
  });

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<State>,
    @Inject(ALERT_SERVICE_TOKEN) private alertService: AlertServiceInterface
  ) {}
}
