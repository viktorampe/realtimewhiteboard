import { TaskQueries } from '.';
import { TaskFixture } from '../../+fixtures/Task.fixture';
import { TaskInterface } from '../../+models';
import { State } from './task.reducer';

describe('Task Selectors', () => {
  function createTask(id: number, teacherId: number): TaskInterface | any {
    return {
      id: id,
      personId: teacherId
    };
  }

  function createState(
    tasks: TaskInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: tasks ? tasks.map(task => task.id) : [],
      entities: tasks
        ? tasks.reduce(
            (entityMap, task) => ({
              ...entityMap,
              [task.id]: task
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskState: State;
  let storeState: any;

  describe('Task Selectors', () => {
    beforeEach(() => {
      taskState = createState(
        [
          createTask(4, 1),
          createTask(1, 1),
          createTask(2, 2),
          createTask(3, 2)
        ],
        true,
        'no error'
      );
      storeState = { tasks: taskState };
    });
    it('getError() should return the error', () => {
      const results = TaskQueries.getError(storeState);
      expect(results).toBe(taskState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskQueries.getLoaded(storeState);
      expect(results).toBe(taskState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskQueries.getAll(storeState);
      expect(results).toEqual([
        createTask(4, 1),
        createTask(1, 1),
        createTask(2, 2),
        createTask(3, 2)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskQueries.getAllEntities(storeState);
      expect(results).toEqual(taskState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTask(3, 2),
        createTask(1, 1),
        undefined,
        createTask(2, 2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTask(2, 2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });
    it('getShared() should return the tasks you do not own', () => {
      const results = TaskQueries.getShared(storeState, { userId: 1 });
      expect(results).toEqual([createTask(2, 2), createTask(3, 2)]);
    });
    it('getOwn() should return the tasks you own', () => {
      const results = TaskQueries.getOwn(storeState, { userId: 1 });
      expect(results).toEqual([createTask(4, 1), createTask(1, 1)]);
    });

    it('getSharedLearningAreaIds', () => {
      const results = TaskQueries.getSharedLearningAreaIds(
        {
          tasks: createState([
            new TaskFixture({ id: 1, personId: 3, learningAreaId: 1 }),
            new TaskFixture({ id: 2, personId: 3, learningAreaId: 2 }),
            new TaskFixture({ id: 3, learningAreaId: 1 })
          ])
        },
        { userId: 3 }
      );
      expect(results).toEqual(new Set([1]));
    });

    it('getSharedTaskIdsByLearningAreaId', () => {
      const results = TaskQueries.getSharedTaskIdsByLearningAreaId(
        {
          tasks: createState([
            new TaskFixture({ id: 1, personId: 3, learningAreaId: 1 }),
            new TaskFixture({ id: 2, personId: 3, learningAreaId: 2 }),
            new TaskFixture({ id: 3, learningAreaId: 1 })
          ])
        },
        { learningAreaId: 1, userId: 3 }
      );
      expect(results).toEqual([3]);
    });
  });
});
