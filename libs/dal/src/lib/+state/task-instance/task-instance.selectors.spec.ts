import { TaskInstanceQueries } from '.';
import { TaskInstanceInterface } from '../../+models';
import { State } from './task-instance.reducer';

describe('TaskInstance Selectors', () => {
  function createTaskInstance(id: number): TaskInstanceInterface | any {
    return {
      id: id
    };
  }

  function createState(
    taskInstances: TaskInstanceInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: taskInstances ? taskInstances.map(taskInstance => taskInstance.id) : [],
      entities: taskInstances
        ? taskInstances.reduce(
            (entityMap, taskInstance) => ({
              ...entityMap,
              [taskInstance.id]: taskInstance
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskInstanceState: State;
  let storeState: any;

  describe('TaskInstance Selectors', () => {
    beforeEach(() => {
      taskInstanceState = createState(
        [
          createTaskInstance(4),
          createTaskInstance(1),
          createTaskInstance(2),
          createTaskInstance(3)
        ],
        true,
        'no error'
      );
      storeState = { taskInstances: taskInstanceState };
    });
    it('getError() should return the error', () => {
      const results = TaskInstanceQueries.getError(storeState);
      expect(results).toBe(taskInstanceState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskInstanceQueries.getLoaded(storeState);
      expect(results).toBe(taskInstanceState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskInstanceQueries.getAll(storeState);
      expect(results).toEqual([
        createTaskInstance(4),
        createTaskInstance(1),
        createTaskInstance(2),
        createTaskInstance(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskInstanceQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskInstanceQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskInstanceQueries.getAllEntities(storeState);
      expect(results).toEqual(taskInstanceState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskInstanceQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTaskInstance(3),
        createTaskInstance(1),
        undefined,
        createTaskInstance(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskInstanceQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTaskInstance(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskInstanceQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
  });
});
