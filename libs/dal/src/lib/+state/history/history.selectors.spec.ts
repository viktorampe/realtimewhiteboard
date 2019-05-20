import { HistoryQueries } from '.';
import { HistoryInterface } from '../../+models';
import { State } from './history.reducer';

describe('History Selectors', () => {
  function createHistory(id: number): HistoryInterface | any {
    return {
      id: id
    };
  }

  function createState(
    history: HistoryInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: history ? history.map(historyItem => historyItem.id) : [],
      entities: history
        ? history.reduce(
            (entityMap, historyItem) => ({
              ...entityMap,
              [historyItem.id]: history
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let historyState: State;
  let storeState: any;

  describe('History Selectors', () => {
    beforeEach(() => {
      historyState = createState(
        [
          createHistory(4),
          createHistory(1),
          createHistory(2),
          createHistory(3)
        ],
        true,
        'no error'
      );
      storeState = { history: historyState };
    });
    it('getError() should return the error', () => {
      const results = HistoryQueries.getError(storeState);
      expect(results).toBe(historyState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = HistoryQueries.getLoaded(storeState);
      expect(results).toBe(historyState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = HistoryQueries.getAll(storeState);
      expect(results).toEqual([
        createHistory(4),
        createHistory(1),
        createHistory(2),
        createHistory(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = HistoryQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = HistoryQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = HistoryQueries.getAllEntities(storeState);
      expect(results).toEqual(historyState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = HistoryQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createHistory(3),
        createHistory(1),
        undefined,
        createHistory(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = HistoryQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createHistory(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = HistoryQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
