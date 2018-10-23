import { AlertQueries } from '.';
import { AlertInterface } from '../../+models';
import { State } from './alert.reducer';

describe('Alert Selectors', () => {
  function createAlert(id: number): AlertInterface | any {
    return {
      id: id
    };
  }

  function createState(
    alerts: AlertInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
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
      loaded: loaded,
      error: error
    };
  }

  let alertState: State;
  let storeState: any;

  describe('Alert Selectors', () => {
    beforeEach(() => {
      alertState = createState(
        [
          createAlert(4),
          createAlert(1),
          createAlert(2),
          createAlert(3)
        ],
        true,
        'no error'
      );
      storeState = { alerts: alertState };
    });
    it('getError() should return the error', () => {
      const results = AlertQueries.getError(storeState);
      expect(results).toBe(alertState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = AlertQueries.getLoaded(storeState);
      expect(results).toBe(alertState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = AlertQueries.getAll(storeState);
      expect(results).toEqual([
        createAlert(4),
        createAlert(1),
        createAlert(2),
        createAlert(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = AlertQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = AlertQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = AlertQueries.getAllEntities(storeState);
      expect(results).toEqual(alertState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = AlertQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createAlert(3),
        createAlert(1),
        undefined,
        createAlert(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = AlertQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createAlert(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = AlertQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
