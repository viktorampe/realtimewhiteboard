import { YearQueries } from '.';
import { YearInterface } from '../../+models';
import { State } from './year.reducer';

describe('Year Selectors', () => {
  function createYear(id: number): YearInterface | any {
    return {
      id: id
    };
  }

  function createState(
    years: YearInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: years ? years.map(year => year.id) : [],
      entities: years
        ? years.reduce(
            (entityMap, year) => ({
              ...entityMap,
              [year.id]: year
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let yearState: State;
  let storeState: any;

  describe('Year Selectors', () => {
    beforeEach(() => {
      yearState = createState(
        [createYear(4), createYear(1), createYear(2), createYear(3)],
        true,
        'no error'
      );
      storeState = { years: yearState };
    });
    it('getError() should return the error', () => {
      const results = YearQueries.getError(storeState);
      expect(results).toBe(yearState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = YearQueries.getLoaded(storeState);
      expect(results).toBe(yearState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = YearQueries.getAll(storeState);
      expect(results).toEqual([
        createYear(4),
        createYear(1),
        createYear(2),
        createYear(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = YearQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = YearQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = YearQueries.getAllEntities(storeState);
      expect(results).toEqual(yearState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = YearQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createYear(3),
        createYear(1),
        undefined,
        createYear(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = YearQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createYear(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = YearQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
