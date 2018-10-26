import { AlertQueries } from '.';
import { AlertQueueInterface } from '../../+models';
import { State } from './alert.reducer';

let mockData: {
  timeStamp: number;
};

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

describe('Alert Selectors', () => {
  mockData = { timeStamp: new Date(1983, 3, 6).getTime() };

  function createAlert(id: number): AlertQueueInterface | any {
    return {
      id: id,
      // Adds the id in minutes to the validFrom Date
      // Since the ids are 1 -> 4, this gives 4 alerts with an interval of 1 minute
      validFrom: mockData.timeStamp + id * 60000,
      // Returns a boolean based on the id
      // Even ids return true, odd ids return false
      read: Number.isInteger(id / 2)
    };
  }

  function createState(
    alerts: AlertQueueInterface[],
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
        [createAlert(4), createAlert(1), createAlert(2), createAlert(3)],
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

    it('getUnread() should return alerts with the read property set to false', () => {
      const results = AlertQueries.getUnread(storeState);
      expect(results).toEqual([createAlert(1), createAlert(3)]);
    });

    it('getRecent() should return alerts with the ValidFrom property >= the thresholdDate', () => {
      const results = AlertQueries.getRecentByDate(storeState, {
        timeThreshold: mockData.timeStamp + 2 * 60000
      });
      expect(results).toEqual([createAlert(2), createAlert(3), createAlert(4)]);
    });
  });
});
