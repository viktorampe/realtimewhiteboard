import { ClassGroupQueries } from '.';
import { ClassGroupInterface } from '../../+models';
import { State } from './class-group.reducer';

describe('ClassGroup Selectors', () => {
  function createClassGroup(id: number): ClassGroupInterface | any {
    return {
      id: id
    };
  }

  function createState(
    classGroups: ClassGroupInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: classGroups ? classGroups.map(classGroup => classGroup.id) : [],
      entities: classGroups
        ? classGroups.reduce(
            (entityMap, classGroup) => ({
              ...entityMap,
              [classGroup.id]: classGroup
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let classGroupState: State;
  let storeState: any;

  describe('ClassGroup Selectors', () => {
    beforeEach(() => {
      classGroupState = createState(
        [
          createClassGroup(4),
          createClassGroup(1),
          createClassGroup(2),
          createClassGroup(3)
        ],
        true,
        'no error'
      );
      storeState = { classGroups: classGroupState };
    });
    it('getError() should return the error', () => {
      const results = ClassGroupQueries.getError(storeState);
      expect(results).toBe(classGroupState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = ClassGroupQueries.getLoaded(storeState);
      expect(results).toBe(classGroupState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = ClassGroupQueries.getAll(storeState);
      expect(results).toEqual([
        createClassGroup(4),
        createClassGroup(1),
        createClassGroup(2),
        createClassGroup(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = ClassGroupQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = ClassGroupQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = ClassGroupQueries.getAllEntities(storeState);
      expect(results).toEqual(classGroupState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = ClassGroupQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createClassGroup(3),
        createClassGroup(1),
        undefined,
        createClassGroup(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = ClassGroupQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createClassGroup(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = ClassGroupQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
