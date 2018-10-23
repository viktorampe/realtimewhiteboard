import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { AlertQueueInterface } from '../../+models';

export enum AlertsActionTypes {
  AlertsLoaded = '[Alerts] Alerts Loaded',
  AlertsLoadError = '[Alerts] Load Error',
  LoadAlerts = '[Alerts] Load Alerts',
  NewAlertsLoaded = '[Alerts] New Alerts Loaded',
  LoadNewAlerts = '[Alerts] Load New Alerts',
  SetReadAlert = '[Alerts] Set as Read Alert',
  SetReadAlerts = '[Alerts] Set as Read Alerts'
  // AddAlert = '[Alerts] Add Alert',
  // UpsertAlert = '[Alerts] Upsert Alert',
  // AddAlerts = '[Alerts] Add Alerts',
  // UpsertAlerts = '[Alerts] Upsert Alerts',
  // UpdateAlert = '[Alerts] Update Alert',
  // UpdateAlerts = '[Alerts] Update Alerts',
  // DeleteAlert = '[Alerts] Delete Alert',
  // DeleteAlerts = '[Alerts] Delete Alerts',
  // ClearAlerts = '[Alerts] Clear Alerts'
}

export class LoadAlerts implements Action {
  readonly type = AlertsActionTypes.LoadAlerts;

  constructor(
    public payload: { force?: boolean; userId: number; timeStamp?: Date }
  ) {}
}

export class AlertsLoaded implements Action {
  readonly type = AlertsActionTypes.AlertsLoaded;

  constructor(
    public payload: { alerts: AlertQueueInterface[]; timeStamp: Date }
  ) {}
}

export class LoadNewAlerts implements Action {
  readonly type = AlertsActionTypes.LoadNewAlerts;

  constructor(
    public payload: { force?: boolean; userId: number; timeStamp?: Date }
  ) {}
}

export class NewAlertsLoaded implements Action {
  readonly type = AlertsActionTypes.NewAlertsLoaded;

  constructor(
    public payload: { alerts: AlertQueueInterface[]; timeStamp: Date }
  ) {}
}

export class AlertsLoadError implements Action {
  readonly type = AlertsActionTypes.AlertsLoadError;
  constructor(public payload: any) {}
}

export class SetReadAlert implements Action {
  readonly type = AlertsActionTypes.SetReadAlert;
  readonly updatePayload: Update<AlertQueueInterface>;

  constructor(
    public payload: {
      personId: number;
      alertId: number;
      read?: boolean;
      intended?: boolean;
    }
  ) {
    this.updatePayload = {
      id: payload.alertId,
      changes: {
        read: payload.read === false ? false : true
      }
    };
  }
}

export class SetReadAlerts implements Action {
  readonly type = AlertsActionTypes.SetReadAlerts;
  readonly updatePayload: Update<AlertQueueInterface>[];

  constructor(
    public payload: {
      personId: number;
      alertIds: number[];
      read?: boolean;
      intended?: boolean;
    }
  ) {
    this.updatePayload = payload.alertIds.map(alertId =>
      Object.assign(
        {},
        {
          id: alertId,
          changes: {
            read: payload.read === false ? false : true
          }
        }
      )
    );
  }
}

// export class AddAlert implements Action {
//   readonly type = AlertsActionTypes.AddAlert;

//   constructor(public payload: { alert: AlertQueueInterface }) {}
// }

// export class UpsertAlert implements Action {
//   readonly type = AlertsActionTypes.UpsertAlert;

//   constructor(public payload: { alert: AlertQueueInterface }) {}
// }

// export class AddAlerts implements Action {
//   readonly type = AlertsActionTypes.AddAlerts;

//   constructor(public payload: { alerts: AlertQueueInterface[] }) {}
// }

// export class UpsertAlerts implements Action {
//   readonly type = AlertsActionTypes.UpsertAlerts;

//   constructor(public payload: { alerts: AlertQueueInterface[] }) {}
// }

// export class UpdateAlert implements Action {
//   readonly type = AlertsActionTypes.UpdateAlert;

//   constructor(public payload: { alert: Update<AlertQueueInterface> }) {}
// }

// export class UpdateAlerts implements Action {
//   readonly type = AlertsActionTypes.UpdateAlerts;

//   constructor(public payload: { alerts: Update<AlertQueueInterface>[] }) {}
// }

// export class DeleteAlert implements Action {
//   readonly type = AlertsActionTypes.DeleteAlert;

//   constructor(public payload: { id: number }) {}
// }

// export class DeleteAlerts implements Action {
//   readonly type = AlertsActionTypes.DeleteAlerts;

//   constructor(public payload: { ids: number[] }) {}
// }

// export class ClearAlerts implements Action {
//   readonly type = AlertsActionTypes.ClearAlerts;
// }

export type AlertsActions =
  | LoadAlerts
  | AlertsLoaded
  | AlertsLoadError
  | LoadNewAlerts
  | NewAlertsLoaded
  | SetReadAlert
  | SetReadAlerts;
// | AddAlert
// | UpsertAlert
// | AddAlerts
// | UpsertAlerts
// | UpdateAlert
// | UpdateAlerts
// | DeleteAlert
// | DeleteAlerts
// | ClearAlerts;
