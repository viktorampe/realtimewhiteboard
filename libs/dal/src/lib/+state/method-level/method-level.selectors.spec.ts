import { MethodLevelQueries } from '.';
import { MethodLevelInterface } from '../../+models';
import { State } from './method-level.reducer';

describe('MethodLevel Selectors', () => {
  function createMethodLevel(id: number): MethodLevelInterface | any {
    return {
      id: id
    };
  }

  function createState(
    methodLevels: MethodLevelInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: methodLevels ? methodLevels.map(methodLevel => methodLevel.id) : [],
      entities: methodLevels
        ? methodLevels.reduce(
            (entityMap, methodLevel) => ({
              ...entityMap,
              [methodLevel.id]: methodLevel
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let methodLevelState: State;
  let storeState: any;

  describe('MethodLevel Selectors', () => {
    beforeEach(() => {
      methodLevelState = createState(
        [
          createMethodLevel(4),
          createMethodLevel(1),
          createMethodLevel(2),
          createMethodLevel(3)
        ],
        true,
        'no error'
      );
      storeState = { methodLevels: methodLevelState };
    });
    it('getError() should return the error', () => {
      const results = MethodLevelQueries.getError(storeState);
      expect(results).toBe(methodLevelState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = MethodLevelQueries.getLoaded(storeState);
      expect(results).toBe(methodLevelState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = MethodLevelQueries.getAll(storeState);
      expect(results).toEqual([
        createMethodLevel(4),
        createMethodLevel(1),
        createMethodLevel(2),
        createMethodLevel(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = MethodLevelQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = MethodLevelQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = MethodLevelQueries.getAllEntities(storeState);
      expect(results).toEqual(methodLevelState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = MethodLevelQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createMethodLevel(3),
        createMethodLevel(1),
        undefined,
        createMethodLevel(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = MethodLevelQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createMethodLevel(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = MethodLevelQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
