import { HistoryQueries } from '.';
import { HistoryFixture } from '../../+fixtures';
import { HistoryInterface, HistoryTypesEnum } from '../../+models';
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

    it('getByType() should return all history with the provided type', () => {
      const mockHistory = [
        new HistoryFixture({ id: 4, type: HistoryTypesEnum.BOEKE }),
        new HistoryFixture({ id: 1 }),
        new HistoryFixture({ id: 2, type: HistoryTypesEnum.BOEKE }),
        new HistoryFixture({ id: 3, type: HistoryTypesEnum.BUNDLE })
      ];

      historyState = createState(mockHistory, true, 'no error');

      storeState = { history: historyState };

      const results = HistoryQueries.getByType(storeState, {
        type: HistoryTypesEnum.BOEKE
      });

      expect(results).toEqual([mockHistory[2], mockHistory[0]]);
    });

    describe('historyByType', () => {
      let mockHistory: HistoryInterface[];
      beforeEach(() => {
        mockHistory = [
          new HistoryFixture({ id: 4, type: 'foo', created: new Date(1) }),
          new HistoryFixture({ id: 1, type: 'foo', created: new Date(2) }),
          new HistoryFixture({ id: 2, type: 'bar', created: new Date(229) }),
          new HistoryFixture({ id: 3, type: 'baz', created: new Date(1) }),
          new HistoryFixture({ id: 5, type: 'bar', created: new Date(114) })
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
        mockHistory = [
          new HistoryFixture({ id: 4, type: 'foo', created: new Date(1) }),
          new HistoryFixture({ id: 1, type: 'foo', created: new Date(2) }),
          new HistoryFixture({ id: 2, type: 'bar', created: new Date(2290) }),
          new HistoryFixture({ id: 3, type: 'baz', created: new Date(1) }),
          new HistoryFixture({ id: 5, type: 'bar', created: new Date(1140) }),
          new HistoryFixture({ id: 6, type: 'bar', created: new Date(1160) }),
          new HistoryFixture({ id: 7, type: 'bar', created: new Date(1170) }),
          new HistoryFixture({ id: 8, type: 'bar', created: new Date(1180) }),
          new HistoryFixture({ id: 9, type: 'bar', created: new Date(1190) }),
          new HistoryFixture({ id: 10, type: 'bar', created: new Date(1200) }),
          new HistoryFixture({ id: 11, type: 'bar', created: new Date(1210) }),
          new HistoryFixture({ id: 12, type: 'bar', created: new Date(1220) }),
          new HistoryFixture({ id: 13, type: 'bar', created: new Date(1230) }),
          new HistoryFixture({ id: 14, type: 'bar', created: new Date(1240) }),
          new HistoryFixture({ id: 15, type: 'bar', created: new Date(1250) }),
          new HistoryFixture({ id: 16, type: 'bar', created: new Date(1260) }),
          new HistoryFixture({ id: 17, type: 'bar', created: new Date(1270) }),
          new HistoryFixture({ id: 18, type: 'bar', created: new Date(1280) }),
          new HistoryFixture({ id: 19, type: 'bar', created: new Date(1290) }),
          new HistoryFixture({ id: 20, type: 'bar', created: new Date(100) })
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
