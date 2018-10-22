import { UnlockedBoekeGroupQueries } from '.';
import { UnlockedBoekeGroupInterface } from '../../+models';
import { State } from './unlocked-boeke-group.reducer';

describe('UnlockedBoekeGroup Selectors', () => {
  function createUnlockedBoekeGroup(
    id: number
  ): UnlockedBoekeGroupInterface | any {
    return {
      id: id,
      teacherId: Math.round(id / 2)
    };
  }

  function createState(
    unlockedBoekeGroups: UnlockedBoekeGroupInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: unlockedBoekeGroups
        ? unlockedBoekeGroups.map(unlockedBoekeGroup => unlockedBoekeGroup.id)
        : [],
      entities: unlockedBoekeGroups
        ? unlockedBoekeGroups.reduce(
            (entityMap, unlockedBoekeGroup) => ({
              ...entityMap,
              [unlockedBoekeGroup.id]: unlockedBoekeGroup
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let unlockedBoekeGroupState: State;
  let storeState: any;

  describe('UnlockedBoekeGroup Selectors', () => {
    beforeEach(() => {
      unlockedBoekeGroupState = createState(
        [
          createUnlockedBoekeGroup(4),
          createUnlockedBoekeGroup(1),
          createUnlockedBoekeGroup(2),
          createUnlockedBoekeGroup(3)
        ],
        true,
        'no error'
      );
      storeState = { unlockedBoekeGroups: unlockedBoekeGroupState };
    });
    it('getError() should return the error', () => {
      const results = UnlockedBoekeGroupQueries.getError(storeState);
      expect(results).toBe(unlockedBoekeGroupState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = UnlockedBoekeGroupQueries.getLoaded(storeState);
      expect(results).toBe(unlockedBoekeGroupState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = UnlockedBoekeGroupQueries.getAll(storeState);
      expect(results).toEqual([
        createUnlockedBoekeGroup(4),
        createUnlockedBoekeGroup(1),
        createUnlockedBoekeGroup(2),
        createUnlockedBoekeGroup(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = UnlockedBoekeGroupQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = UnlockedBoekeGroupQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = UnlockedBoekeGroupQueries.getAllEntities(storeState);
      expect(results).toEqual(unlockedBoekeGroupState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = UnlockedBoekeGroupQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createUnlockedBoekeGroup(3),
        createUnlockedBoekeGroup(1),
        undefined,
        createUnlockedBoekeGroup(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = UnlockedBoekeGroupQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createUnlockedBoekeGroup(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = UnlockedBoekeGroupQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });

  it('getShared() should return undefined if the entity is not present', () => {
    const results = UnlockedBoekeGroupQueries.getShared(storeState, {
      userId: 1
    });
    expect(results).toEqual([
      createUnlockedBoekeGroup(4),
      createUnlockedBoekeGroup(3)
    ]);
  });
  it('getOwn() should return the desired entity', () => {
    const results = UnlockedBoekeGroupQueries.getOwn(storeState, {
      userId: 1
    });
    expect(results).toEqual([
      createUnlockedBoekeGroup(1),
      createUnlockedBoekeGroup(2)
    ]);
  });
});
