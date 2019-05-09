import { Update } from '@ngrx/entity';
import { AlertActions } from '.';
import { TeacherStudentActions } from '../teacher-student';
import { AlertQueueInterface } from './../../+models/AlertQueue.interface';
import { initialState, reducer, State } from './alert.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'read' and replace this with a property name of the Alert entity.
 * - set the initial property value via '[read]InitialValue'.
 * - set the updated property value via '[read]UpdatedValue'.
 */
const readInitialValue = false;
const readUpdatedValue = true;

/**
 * Creates a Alert.
 * @param {number} id
 * @returns {AlertQueueInterface}
 */
function createAlert(
  id: number,
  read: any = readInitialValue
): AlertQueueInterface | any {
  return {
    id: id,
    read: read,
    validFrom: new Date(1983, 3, 6, -id)
  };
}

/**
 * Utility to create the alert state.
 *
 * @param {AlertQueueInterface[]} alerts
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  alerts: AlertQueueInterface[],
  loaded: boolean = false,
  lastUpdateTimeStamp: number = null,
  error?: any
): State {
  const state: any = {
    ids: alerts
      ? alerts
          .sort((a, b) => b.validFrom.getTime() - a.validFrom.getTime())
          .map(alert => alert.id)
      : [],
    entities: alerts
      ? alerts.reduce((entityMap, alert) => {
          entityMap[alert.id] = alert;
          return entityMap;
        }, {})
      : {},
    loaded: loaded
  };
  if (lastUpdateTimeStamp !== undefined)
    state.lastUpdateTimeStamp = lastUpdateTimeStamp;

  if (error !== undefined) state.error = error;
  return state;
}

describe('Alerts Reducer', () => {
  let alerts: AlertQueueInterface[];
  let updateTime: number;
  let newUpdateTime: number;
  beforeEach(() => {
    alerts = [createAlert(1), createAlert(2), createAlert(3)];
    updateTime = new Date(1983, 3, 6).getTime();
    newUpdateTime = new Date(1983, 3, 6, 1).getTime();
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all alerts', () => {
      const action = new AlertActions.AlertsLoaded({
        alerts,
        timeStamp: updateTime
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(alerts, true, updateTime));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new AlertActions.AlertsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, null, error));
    });
  });

  describe('new loaded action', () => {
    it('should add new alerts', () => {
      const loadedState = createState(alerts, true, updateTime);
      const newAlerts: AlertQueueInterface[] = [
        createAlert(3),
        createAlert(4),
        createAlert(5)
      ];

      const action = new AlertActions.NewAlertsLoaded({
        alerts: newAlerts,
        timeStamp: newUpdateTime
      });
      const result = reducer(loadedState, action);

      // merge arrays without duplicates
      const mergedAlerts: AlertQueueInterface[] = alerts;
      newAlerts.map(a => {
        if (!alerts.filter(x => x.id === a.id).length) mergedAlerts.push(a);
      });

      expect(result).toEqual(createState(mergedAlerts, true, newUpdateTime));
    });
  });

  describe('set read actions', () => {
    it('should set read on an alert', () => {
      const alert = alerts[0];
      const startState = createState([alert], true);

      const action = new AlertActions.SetReadAlert({
        personId: alert.recipientId,
        alertIds: alert.id,
        read: readUpdatedValue
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createAlert(1, readUpdatedValue)], true)
      );

      // Also check if read can be set back to initial
      // (check needed because of default values)
      const actionInitial = new AlertActions.SetReadAlert({
        personId: alert.recipientId,
        alertIds: alert.id,
        read: readInitialValue
      });

      const resultInitial = reducer(result, actionInitial);
      expect(resultInitial).toEqual(
        createState([createAlert(1, readInitialValue)], true)
      );
    });

    it('should set read on multiple alerts', () => {
      const startState = createState(alerts);
      const updates: Update<AlertQueueInterface>[] = [
        {
          id: 1,
          changes: {
            read: readUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            read: readUpdatedValue
          }
        }
      ];
      const action = new AlertActions.SetReadAlert({
        personId: alerts[0].recipientId,
        alertIds: [1, 2]
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createAlert(1, readUpdatedValue),
          createAlert(2, readUpdatedValue),
          alerts[2]
        ])
      );

      // Also check if read can be set back to initial
      // (check needed because of default values)
      const actionInitial = new AlertActions.SetReadAlert({
        personId: alerts[0].recipientId,
        alertIds: [alerts[0].id, alerts[1].id],
        read: readInitialValue
      });

      const resultInitial = reducer(result, actionInitial);
      expect(resultInitial).toEqual(
        createState([
          createAlert(1, readInitialValue),
          createAlert(2, readInitialValue),
          alerts[2]
        ])
      );
    });
  });

  describe('add actions', () => {
    it('should add one alert', () => {
      const alert = alerts[0];
      const action = new AlertActions.AddAlert({
        alert
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([alert], false));
    });

    it('should add multiple alerts', () => {
      const action = new AlertActions.AddAlerts({ alerts });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(alerts, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one alert', () => {
      const originalAlert = alerts[0];

      const startState = reducer(
        initialState,
        new AlertActions.AddAlert({
          alert: originalAlert
        })
      );

      const updatedAlert = createAlert(alerts[0].id, 'test');

      const action = new AlertActions.UpsertAlert({
        alert: updatedAlert
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedAlert.id]).toEqual(updatedAlert);
    });

    it('should upsert many alerts', () => {
      const startState = createState(alerts);

      const alertsToInsert = [
        createAlert(1),
        createAlert(2),
        createAlert(3),
        createAlert(4)
      ];
      const action = new AlertActions.UpsertAlerts({
        alerts: alertsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(alertsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an alert', () => {
      const alert = alerts[0];
      const startState = createState([alert]);
      const update: Update<AlertQueueInterface> = {
        id: 1,
        changes: {
          read: readUpdatedValue
        }
      };
      const action = new AlertActions.UpdateAlert({
        alert: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createAlert(1, readUpdatedValue)]));
    });

    it('should update multiple alerts', () => {
      const startState = createState(alerts);
      const updates: Update<AlertQueueInterface>[] = [
        {
          id: 1,
          changes: {
            read: readUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            read: readUpdatedValue
          }
        }
      ];
      const action = new AlertActions.UpdateAlerts({
        alerts: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createAlert(1, readUpdatedValue),
          createAlert(2, readUpdatedValue),
          alerts[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one alert ', () => {
      const alert = alerts[0];
      const startState = createState([alert]);
      const action = new AlertActions.DeleteAlert({
        id: alert.id,
        personId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple alerts', () => {
      const startState = createState(alerts);
      const action = new AlertActions.DeleteAlerts({
        ids: [alerts[0].id, alerts[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([alerts[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the alerts collection', () => {
      const startState = createState(
        alerts,
        true,
        undefined,
        'something went wrong'
      );
      const action = new AlertActions.ClearAlerts();
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([], true, undefined, 'something went wrong')
      );
    });
  });

  describe('invalidate action', () => {
    it('should trigger from LinkTeacherStudent', () => {
      const startState = createState(alerts, true);
      const action = new TeacherStudentActions.LinkTeacherStudent({
        publicKey: 'foo',
        userId: 1,
        useCustomErrorHandler: true
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(alerts, false));
    });

    it('should trigger from UnlinkTeacherStudent', () => {
      const startState = createState(alerts, true);
      const action = new TeacherStudentActions.UnlinkTeacherStudent({
        teacherId: 1,
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(alerts, false));
    });
  });
});
