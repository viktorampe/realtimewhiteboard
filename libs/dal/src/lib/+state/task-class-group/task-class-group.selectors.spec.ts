import { TaskClassGroupQueries } from '.';
import { TaskClassGroupInterface } from '../../+models';
import { State } from './task-class-group.reducer';

describe('TaskClassGroup Selectors', () => {
  function createTaskClassGroup(id: number): TaskClassGroupInterface | any {
    return {
      id: id
    };
  }

  function createState(
    taskClassGroups: TaskClassGroupInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: taskClassGroups
        ? taskClassGroups.map(taskClassGroup => taskClassGroup.id)
        : [],
      entities: taskClassGroups
        ? taskClassGroups.reduce(
            (entityMap, taskClassGroup) => ({
              ...entityMap,
              [taskClassGroup.id]: taskClassGroup
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskClassGroupState: State;
  let storeState: any;

  describe('TaskClassGroup Selectors', () => {
    beforeEach(() => {
      taskClassGroupState = createState(
        [
          createTaskClassGroup(4),
          createTaskClassGroup(1),
          createTaskClassGroup(2),
          createTaskClassGroup(3)
        ],
        true,
        'no error'
      );
      storeState = { taskClassGroups: taskClassGroupState };
    });
    it('getError() should return the error', () => {
      const results = TaskClassGroupQueries.getError(storeState);
      expect(results).toBe(taskClassGroupState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskClassGroupQueries.getLoaded(storeState);
      expect(results).toBe(taskClassGroupState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskClassGroupQueries.getAll(storeState);
      expect(results).toEqual([
        createTaskClassGroup(4),
        createTaskClassGroup(1),
        createTaskClassGroup(2),
        createTaskClassGroup(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskClassGroupQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskClassGroupQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskClassGroupQueries.getAllEntities(storeState);
      expect(results).toEqual(taskClassGroupState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskClassGroupQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTaskClassGroup(3),
        createTaskClassGroup(1),
        undefined,
        createTaskClassGroup(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskClassGroupQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTaskClassGroup(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskClassGroupQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
