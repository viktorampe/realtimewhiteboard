import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AlertQueueInterface } from '../../+models';
import {
  TeacherStudentActions,
  TeacherStudentActionTypes
} from '../teacher-student/teacher-student.actions';
import { AlertsActions, AlertsActionTypes } from './alert.actions';

export const NAME = 'alerts';

export function sortAlerts(
  a: AlertQueueInterface,
  b: AlertQueueInterface
): number {
  // sort by date DESC
  const dateA = new Date(a.sentAt || a.validFrom);
  const dateB = new Date(b.sentAt || b.validFrom);
  return dateB.getTime() - dateA.getTime();
}

export interface State extends EntityState<AlertQueueInterface> {
  // additional entities state properties
  loaded: boolean;
  lastUpdateTimeStamp?: number;
  error?: any;
}

export const adapter: EntityAdapter<AlertQueueInterface> = createEntityAdapter<
  AlertQueueInterface
>({
  sortComparer: sortAlerts
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loaded: false,
  lastUpdateTimeStamp: null
});

export function reducer(
  state = initialState,
  action: AlertsActions | TeacherStudentActions
): State {
  switch (action.type) {
    case AlertsActionTypes.AlertsLoaded: {
      return adapter.addAll(action.payload.alerts, {
        ...state,
        loaded: true,
        lastUpdateTimeStamp: action.payload.timeStamp || Date.now()
      });
    }

    case AlertsActionTypes.NewAlertsLoaded: {
      return adapter.addMany(action.payload.alerts, {
        ...state,
        lastUpdateTimeStamp: action.payload.timeStamp
      });
    }

    case AlertsActionTypes.AlertsLoadError: {
      return { ...state, error: action.payload, loaded: false };
    }

    case AlertsActionTypes.SetReadAlert: {
      return adapter.updateMany(action.updatePayload, state);
    }

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

    case AlertsActionTypes.ClearAlerts: {
      return adapter.removeAll(state);
    }

    case TeacherStudentActionTypes.LinkTeacherStudent:
    case TeacherStudentActionTypes.UnlinkTeacherStudent:
      return { ...state, loaded: false, lastUpdateTimeStamp: null };

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
