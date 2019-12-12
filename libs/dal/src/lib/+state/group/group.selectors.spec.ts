import { GroupQueries } from '.';
import { GroupInterface } from '../../+models';
import { State } from './group.reducer';

describe('Group Selectors', () => {
  function createGroup(id: number): GroupInterface | any {
    return {
      id: id
    };
  }

  function createState(
    groups: GroupInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: groups ? groups.map(group => group.id) : [],
      entities: groups
        ? groups.reduce(
            (entityMap, group) => ({
              ...entityMap,
              [group.id]: group
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let groupState: State;
  let storeState: any;

  describe('Group Selectors', () => {
    beforeEach(() => {
      groupState = createState(
        [createGroup(4), createGroup(1), createGroup(2), createGroup(3)],
        true,
        'no error'
      );
      storeState = { groups: groupState };
    });
    it('getError() should return the error', () => {
      const results = GroupQueries.getError(storeState);
      expect(results).toBe(groupState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = GroupQueries.getLoaded(storeState);
      expect(results).toBe(groupState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = GroupQueries.getAll(storeState);
      expect(results).toEqual([
        createGroup(4),
        createGroup(1),
        createGroup(2),
        createGroup(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = GroupQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = GroupQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = GroupQueries.getAllEntities(storeState);
      expect(results).toEqual(groupState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = GroupQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createGroup(3),
        createGroup(1),
        undefined,
        createGroup(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = GroupQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createGroup(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = GroupQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
