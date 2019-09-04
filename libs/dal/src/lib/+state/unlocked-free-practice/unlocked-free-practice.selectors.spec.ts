import { UnlockedFreePracticeQueries } from '.';
import { UnlockedFreePracticeInterface } from '../../+models';
import { State } from './unlocked-free-practice.reducer';

describe('UnlockedFreePractice Selectors', () => {
  function createUnlockedFreePractice(
    id: number
  ): UnlockedFreePracticeInterface | any {
    return {
      id: id
    };
  }

  function createState(
    unlockedFreePractices: UnlockedFreePracticeInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: unlockedFreePractices
        ? unlockedFreePractices.map(
            unlockedFreePractice => unlockedFreePractice.id
          )
        : [],
      entities: unlockedFreePractices
        ? unlockedFreePractices.reduce(
            (entityMap, unlockedFreePractice) => ({
              ...entityMap,
              [unlockedFreePractice.id]: unlockedFreePractice
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let unlockedFreePracticeState: State;
  let storeState: any;

  describe('UnlockedFreePractice Selectors', () => {
    beforeEach(() => {
      unlockedFreePracticeState = createState(
        [
          createUnlockedFreePractice(4),
          createUnlockedFreePractice(1),
          createUnlockedFreePractice(2),
          createUnlockedFreePractice(3)
        ],
        true,
        'no error'
      );
      storeState = { unlockedFreePractices: unlockedFreePracticeState };
    });
    it('getError() should return the error', () => {
      const results = UnlockedFreePracticeQueries.getError(storeState);
      expect(results).toBe(unlockedFreePracticeState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UnlockedFreePracticeQueries.getLoaded(storeState);
      expect(results).toBe(unlockedFreePracticeState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UnlockedFreePracticeQueries.getAll(storeState);
      expect(results).toEqual([
        createUnlockedFreePractice(4),
        createUnlockedFreePractice(1),
        createUnlockedFreePractice(2),
        createUnlockedFreePractice(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UnlockedFreePracticeQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UnlockedFreePracticeQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UnlockedFreePracticeQueries.getAllEntities(storeState);
      expect(results).toEqual(unlockedFreePracticeState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UnlockedFreePracticeQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUnlockedFreePractice(3),
        createUnlockedFreePractice(1),
        undefined,
        createUnlockedFreePractice(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UnlockedFreePracticeQueries.getById(storeState, {
        id: 2
      });
      expect(results).toEqual(createUnlockedFreePractice(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UnlockedFreePracticeQueries.getById(storeState, {
        id: 9
      });
      expect(results).toBe(undefined);
    });
  });
});
