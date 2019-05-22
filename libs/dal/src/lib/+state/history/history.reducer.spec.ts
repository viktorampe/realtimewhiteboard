import { HistoryActions } from '.';
import { HistoryInterface } from '../../+models';
import { initialState, reducer, State } from './history.reducer';

const nameInitialValue = 'name_initial';
const nameUpdatedValue = 'name_updated';

/**
 * Creates a History.
 * @param {number} id
 * @returns {HistoryInterface}
 */
function createHistory(
  id: number,
  name: any = nameInitialValue
): HistoryInterface | any {
  return {
    id: id,
    name: name
  };
}

/**
 * Utility to create the history state.
 *
 * @param {HistoryInterface[]} history
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  history: HistoryInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: history ? history.map(historyItem => historyItem.id) : [],
    entities: history
      ? history.reduce(
          (entityMap, historyItem) => ({
            ...entityMap,
            [historyItem.id]: historyItem
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('History Reducer', () => {
  let history: HistoryInterface[];
  beforeEach(() => {
    history = [createHistory(1), createHistory(2), createHistory(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all history', () => {
      const action = new HistoryActions.HistoryLoaded({ history });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(history, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new HistoryActions.HistoryLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('upsert actions', () => {
    it('should upsert one history', () => {
      const originalHistory = history[0];

      const startState = reducer(
        initialState,
        new HistoryActions.UpsertHistory({
          history: originalHistory
        })
      );

      const updatedHistory = createHistory(history[0].id, 'test');

      const action = new HistoryActions.UpsertHistory({
        history: updatedHistory
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedHistory.id]).toEqual(updatedHistory);
    });
  });

  describe('delete actions', () => {
    it('should delete one history ', () => {
      const historyItem = history[0];
      const startState = createState([historyItem]);
      const action = new HistoryActions.DeleteHistory({
        id: historyItem.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });
  });

  describe('clear action', () => {
    it('should clear the history collection', () => {
      const startState = createState(history, true, 'something went wrong');
      const action = new HistoryActions.ClearHistory();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
