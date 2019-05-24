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
              [historyItem.id]: historyItem
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

    describe('historyByType', () => {
      let mockHistory: HistoryInterface[];
      beforeEach(() => {
        // TODO use fixture when merged
        mockHistory = [
          { ...createHistory(4), type: 'foo', created: new Date(1) },
          { ...createHistory(1), type: 'foo', created: new Date(2) },
          { ...createHistory(2), type: 'bar', created: new Date(229) },
          { ...createHistory(3), type: 'baz', created: new Date(1) },
          { ...createHistory(5), type: 'bar', created: new Date(114) }
        ];

        historyState = createState(mockHistory, true, 'no error');
        storeState = { history: historyState };
      });

      it('should group the historyitems by type, ordered -descending- by created date', () => {
        const result = HistoryQueries.historyByType(storeState);

        const expected = {
          foo: [mockHistory[1], mockHistory[0]],
          bar: [mockHistory[2], mockHistory[4]],
          baz: [mockHistory[3]]
        };

        expect(result).toEqual(expected);
      });
    });

    describe('historyByType', () => {
      let mockHistory: HistoryInterface[];
      beforeEach(() => {
        // TODO use fixture when merged
        mockHistory = [
          { ...createHistory(4), type: 'foo', created: new Date(1) },
          { ...createHistory(1), type: 'foo', created: new Date(2) },
          { ...createHistory(2), type: 'bar', created: new Date(2290) },
          { ...createHistory(3), type: 'baz', created: new Date(1) },
          { ...createHistory(5), type: 'bar', created: new Date(1140) },
          { ...createHistory(6), type: 'bar', created: new Date(1160) },
          { ...createHistory(7), type: 'bar', created: new Date(1170) },
          { ...createHistory(8), type: 'bar', created: new Date(1180) },
          { ...createHistory(9), type: 'bar', created: new Date(1190) },
          { ...createHistory(10), type: 'bar', created: new Date(1200) },
          { ...createHistory(11), type: 'bar', created: new Date(1210) },
          { ...createHistory(12), type: 'bar', created: new Date(1220) },
          { ...createHistory(13), type: 'bar', created: new Date(1230) },
          { ...createHistory(14), type: 'bar', created: new Date(1240) },
          { ...createHistory(15), type: 'bar', created: new Date(1250) },
          { ...createHistory(16), type: 'bar', created: new Date(1260) },
          { ...createHistory(17), type: 'bar', created: new Date(1270) },
          { ...createHistory(18), type: 'bar', created: new Date(1280) },
          { ...createHistory(19), type: 'bar', created: new Date(1290) },
          { ...createHistory(20), type: 'bar', created: new Date(100) }
        ];

        historyState = createState(mockHistory, true, 'no error');
        storeState = { history: historyState };
      });

      it('should limit the historyitems to 10 per type', () => {
        const result = HistoryQueries.historyByType(storeState);

        const expected = {
          bar: [
            mockHistory[2],
            mockHistory[18],
            mockHistory[17],
            mockHistory[16],
            mockHistory[15],
            mockHistory[14],
            mockHistory[13],
            mockHistory[12],
            mockHistory[11],
            mockHistory[10]
          ],
          foo: [mockHistory[1], mockHistory[0]],
          baz: [mockHistory[3]]
        };

        expect(result).toEqual(expected);
      });
    });
  });
});
