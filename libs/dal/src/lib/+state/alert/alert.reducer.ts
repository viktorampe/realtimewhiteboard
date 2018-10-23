import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AlertInterface } from '../../+models';
import {
  AlertsActions,
  AlertsActionTypes
} from './alert.actions';

export interface State extends EntityState<AlertInterface> {
  // additional entities state properties
  loaded: boolean;
  error?: any;
}

export const adapter: EntityAdapter<AlertInterface> = createEntityAdapter<
  AlertInterface
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false
});

export function reducer(
  state = initialState,
  action: AlertsActions
): State {
  switch (action.type) {
    case AlertsActionTypes.AddAlert: {
      return adapter.addOne(action.payload.alert, state);
    }

    case AlertsActionTypes.UpsertAlert: {
      return adapter.upsertOne(action.payload.alert, state);
    }

    case AlertsActionTypes.AddAlerts: {
      return adapter.addMany(action.payload.alerts, state);
    }

    case AlertsActionTypes.UpsertAlerts: {
      return adapter.upsertMany(action.payload.alerts, state);
    }

    case AlertsActionTypes.UpdateAlert: {
      return adapter.updateOne(action.payload.alert, state);
    }

    case AlertsActionTypes.UpdateAlerts: {
      return adapter.updateMany(action.payload.alerts, state);
    }

    case AlertsActionTypes.DeleteAlert: {
      return adapter.removeOne(action.payload.id, state);
    }

    case AlertsActionTypes.DeleteAlerts: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case AlertsActionTypes.AlertsLoaded: {
      return adapter.addAll(action.payload.alerts, { ...state, loaded: true });
    }

    case AlertsActionTypes.AlertsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case AlertsActionTypes.ClearAlerts: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
