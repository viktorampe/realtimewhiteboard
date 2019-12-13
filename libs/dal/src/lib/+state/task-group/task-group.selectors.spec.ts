import { TaskGroupQueries } from '.';
import { TaskGroupInterface } from '../../+models';
import { State } from './task-group.reducer';

describe('TaskGroup Selectors', () => {
  function createTaskGroup(id: number): TaskGroupInterface | any {
    return {
      id: id
    };
  }

  function createState(
    taskGroups: TaskGroupInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: taskGroups ? taskGroups.map(taskGroup => taskGroup.id) : [],
      entities: taskGroups
        ? taskGroups.reduce(
            (entityMap, taskGroup) => ({
              ...entityMap,
              [taskGroup.id]: taskGroup
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskGroupState: State;
  let storeState: any;

  describe('TaskGroup Selectors', () => {
    beforeEach(() => {
      taskGroupState = createState(
        [
          createTaskGroup(4),
          createTaskGroup(1),
          createTaskGroup(2),
          createTaskGroup(3)
        ],
        true,
        'no error'
      );
      storeState = { taskGroups: taskGroupState };
    });
    it('getError() should return the error', () => {
      const results = TaskGroupQueries.getError(storeState);
      expect(results).toBe(taskGroupState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskGroupQueries.getLoaded(storeState);
      expect(results).toBe(taskGroupState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskGroupQueries.getAll(storeState);
      expect(results).toEqual([
        createTaskGroup(4),
        createTaskGroup(1),
        createTaskGroup(2),
        createTaskGroup(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskGroupQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskGroupQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskGroupQueries.getAllEntities(storeState);
      expect(results).toEqual(taskGroupState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskGroupQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTaskGroup(3),
        createTaskGroup(1),
        undefined,
        createTaskGroup(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskGroupQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTaskGroup(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskGroupQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
