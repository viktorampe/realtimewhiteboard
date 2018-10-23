import { Update } from '@ngrx/entity';
import {AlertActions } from '.';
import { initialState, reducer, State } from './alert.reducer';
import { AlertInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Alert entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Alert.
 * @param {number} id
 * @returns {AlertInterface}
 */
function createAlert(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): AlertInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the alert state.
 *
 * @param {AlertInterface[]} alerts
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  alerts: AlertInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: alerts ? alerts.map(alert => alert.id) : [],
    entities: alerts
      ? alerts.reduce(
          (entityMap, alert) => ({
            ...entityMap,
            [alert.id]: alert
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('Alerts Reducer', () => {
  let alerts: AlertInterface[];
  beforeEach(() => {
    alerts = [
      createAlert(1),
      createAlert(2),
      createAlert(3)
    ];
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
      const action = new AlertActions.AlertsLoaded({ alerts });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(alerts, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new AlertActions.AlertsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
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

      expect(result).toEqual(
        createState(alertsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an alert', () => {
      const alert = alerts[0];
      const startState = createState([alert]);
      const update: Update<AlertInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new AlertActions.UpdateAlert({
        alert: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createAlert(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple alerts', () => {
      const startState = createState(alerts);
      const updates: Update<AlertInterface>[] = [
        
        {
          id: 1,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          } 
        },
        {
          id: 2,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          }  
        }
      ];
      const action = new AlertActions.UpdateAlerts({
        alerts: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createAlert(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createAlert(2, __EXTRA__PROPERTY_NAMEUpdatedValue), alerts[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one alert ', () => {
      const alert = alerts[0];
      const startState = createState([alert]);
      const action = new AlertActions.DeleteAlert({
        id: alert.id
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
      const startState = createState(alerts, true, 'something went wrong');
      const action = new AlertActions.ClearAlerts();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
