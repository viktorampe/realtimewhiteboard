import { NestedPartial } from '@campus/utils';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { AlertQueueInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';
export enum AlertsActionTypes {
  AlertsLoaded = '[Alerts] Alerts Loaded',
  AlertsLoadError = '[Alerts] Load Error',
  LoadAlerts = '[Alerts] Load Alerts',
  NewAlertsLoaded = '[Alerts] New Alerts Loaded',
  LoadNewAlerts = '[Alerts] Load New Alerts',
  SetReadAlert = '[Alerts] Set as Read Alert',
  SetAlertReadByFilter = '[Alerts] Set Alert Read By Filter',
  StartPollAlerts = '[Alerts] Start Poll Alerts',
  StopPollAlerts = '[Alerts] Stop Poll Alerts',
  AddAlert = '[Alerts] Add Alert',
  UpsertAlert = '[Alerts] Upsert Alert',
  AddAlerts = '[Alerts] Add Alerts',
  UpsertAlerts = '[Alerts] Upsert Alerts',
  UpdateAlert = '[Alerts] Update Alert',
  UpdateAlerts = '[Alerts] Update Alerts',
  DeleteAlert = '[Alerts] Delete Alert',
  DeleteAlerts = '[Alerts] Delete Alerts',
  ClearAlerts = '[Alerts] Clear Alerts'
}

export class LoadAlerts implements Action {
  readonly type = AlertsActionTypes.LoadAlerts;

  constructor(
    public payload: { force?: boolean; userId: number; timeStamp?: number }
  ) {}
}

export class AlertsLoaded implements Action {
  readonly type = AlertsActionTypes.AlertsLoaded;

  constructor(
    public payload: { alerts: AlertQueueInterface[]; timeStamp: number }
  ) {}
}

export class LoadNewAlerts implements Action {
  readonly type = AlertsActionTypes.LoadNewAlerts;

  constructor(public payload: { userId: number; timeStamp?: number }) {}
}

export class NewAlertsLoaded implements Action {
  readonly type = AlertsActionTypes.NewAlertsLoaded;

  constructor(
    public payload: { alerts: AlertQueueInterface[]; timeStamp: number }
  ) {}
}

export class AlertsLoadError implements Action {
  readonly type = AlertsActionTypes.AlertsLoadError;
  constructor(public payload: any) {}
}

export class StartPollAlerts implements Action {
  readonly type = AlertsActionTypes.StartPollAlerts;
  constructor(public payload: { pollingInterval: number; userId: number }) {}
}

export class StopPollAlerts implements Action {
  readonly type = AlertsActionTypes.StopPollAlerts;
  constructor() {}
}

export class SetReadAlert implements FeedbackTriggeringAction {
  readonly type = AlertsActionTypes.SetReadAlert;
  readonly updatePayload: Update<AlertQueueInterface>[];

  constructor(
    public payload: {
      personId: number;
      alertIds: number | number[];
      read?: boolean;
      intended?: boolean;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {
    // alertIds altijd in een array
    let alertIds: number[];
    if (typeof payload.alertIds === 'number') {
      alertIds = [payload.alertIds];
    } else {
      alertIds = payload.alertIds;
    }

    // read moet boolean zijn, default: true
    const readStatus = payload.read !== false;

    this.updatePayload = alertIds.map(alertId => {
      return {
        id: alertId,
        changes: {
          read: readStatus
        }
      };
    });
  }
}

export class SetAlertReadByFilter implements Action {
  readonly type = AlertsActionTypes.SetAlertReadByFilter;

  constructor(
    public payload: {
      personId: number;
      filter: NestedPartial<AlertQueueInterface>;
      read?: boolean;
      intended?: boolean;
      displayResponse?: boolean;
    }
  ) {}
}

export class AddAlert implements Action {
  readonly type = AlertsActionTypes.AddAlert;

  constructor(public payload: { alert: AlertQueueInterface }) {}
}

export class UpsertAlert implements Action {
  readonly type = AlertsActionTypes.UpsertAlert;

  constructor(public payload: { alert: AlertQueueInterface }) {}
}

export class AddAlerts implements Action {
  readonly type = AlertsActionTypes.AddAlerts;

  constructor(public payload: { alerts: AlertQueueInterface[] }) {}
}

export class UpsertAlerts implements Action {
  readonly type = AlertsActionTypes.UpsertAlerts;

  constructor(public payload: { alerts: AlertQueueInterface[] }) {}
}

export class UpdateAlert implements Action {
  readonly type = AlertsActionTypes.UpdateAlert;

  constructor(public payload: { alert: Update<AlertQueueInterface> }) {}
}

export class UpdateAlerts implements Action {
  readonly type = AlertsActionTypes.UpdateAlerts;

  constructor(public payload: { alerts: Update<AlertQueueInterface>[] }) {}
}

export class DeleteAlert implements Action {
  readonly type = AlertsActionTypes.DeleteAlert;

  constructor(
    public payload: { id: number; personId: number; displayResponse?: boolean }
  ) {}
}

export class DeleteAlerts implements Action {
  readonly type = AlertsActionTypes.DeleteAlerts;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearAlerts implements Action {
  readonly type = AlertsActionTypes.ClearAlerts;
}

export type AlertsActions =
  | LoadAlerts
  | AlertsLoaded
  | AlertsLoadError
  | LoadNewAlerts
  | NewAlertsLoaded
  | SetReadAlert
  | SetAlertReadByFilter
  | StartPollAlerts
  | StopPollAlerts
  | AddAlert
  | UpsertAlert
  | AddAlerts
  | UpsertAlerts
  | UpdateAlert
  | UpdateAlerts
  | DeleteAlert
  | DeleteAlerts
  | ClearAlerts;
