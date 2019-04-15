import { TaskEduContentQueries } from '.';
import { TaskEduContentFixture } from '../../+fixtures';
import { TaskEduContentInterface } from '../../+models';
import { State } from './task-edu-content.reducer';

describe('TaskEduContent Selectors', () => {
  function createTaskEduContent(id: number): TaskEduContentInterface | any {
    return {
      id: id
    };
  }

  function createState(
    taskEduContents: TaskEduContentInterface[],
    loaded: boolean = false,
    error?: any
  ): State {
    return {
      ids: taskEduContents
        ? taskEduContents.map(taskEduContent => taskEduContent.id)
        : [],
      entities: taskEduContents
        ? taskEduContents.reduce(
            (entityMap, taskEduContent) => ({
              ...entityMap,
              [taskEduContent.id]: taskEduContent
            }),
            {}
          )
        : {},
      loaded: loaded,
      error: error
    };
  }

  let taskEduContentState: State;
  let storeState: any;

  describe('TaskEduContent Selectors', () => {
    beforeEach(() => {
      taskEduContentState = createState(
        [
          createTaskEduContent(4),
          createTaskEduContent(1),
          createTaskEduContent(2),
          createTaskEduContent(3)
        ],
        true,
        'no error'
      );
      storeState = { taskEduContents: taskEduContentState };
    });
    it('getError() should return the error', () => {
      const results = TaskEduContentQueries.getError(storeState);
      expect(results).toBe(taskEduContentState.error);
    });
    it('getLoaded() should return the loaded boolean', () => {
      const results = TaskEduContentQueries.getLoaded(storeState);
      expect(results).toBe(taskEduContentState.loaded);
    });
    it('getAll() should return an array of the entities in the order from the ids', () => {
      const results = TaskEduContentQueries.getAll(storeState);
      expect(results).toEqual([
        createTaskEduContent(4),
        createTaskEduContent(1),
        createTaskEduContent(2),
        createTaskEduContent(3)
      ]);
    });
    it('getCount() should return number of entities', () => {
      const results = TaskEduContentQueries.getCount(storeState);
      expect(results).toBe(4);
    });
    it('getIds() should return an array with ids in the correct order', () => {
      const results = TaskEduContentQueries.getIds(storeState);
      expect(results).toEqual([4, 1, 2, 3]);
    });
    it('getAllEntities() should return a key value object with all the entities', () => {
      const results = TaskEduContentQueries.getAllEntities(storeState);
      expect(results).toEqual(taskEduContentState.entities);
    });
    it('getByIds() should return an array of the requested entities in order and undefined if the id is not present', () => {
      const results = TaskEduContentQueries.getByIds(storeState, {
        ids: [3, 1, 90, 2]
      });
      expect(results).toEqual([
        createTaskEduContent(3),
        createTaskEduContent(1),
        undefined,
        createTaskEduContent(2)
      ]);
    });
    it('getById() should return the desired entity', () => {
      const results = TaskEduContentQueries.getById(storeState, { id: 2 });
      expect(results).toEqual(createTaskEduContent(2));
    });
    it('getById() should return undefined if the entity is not present', () => {
      const results = TaskEduContentQueries.getById(storeState, { id: 9 });
      expect(results).toBe(undefined);
    });

    it('getUnfinishedTaskIds should return ', () => {
      const results = TaskEduContentQueries.getUnfinishedTaskIds({
        taskEduContents: createState([
          new TaskEduContentFixture({ id: 1, taskId: 11, submitted: false }),
          new TaskEduContentFixture({ id: 2, taskId: 12, submitted: true }),
          new TaskEduContentFixture({ id: 3, taskId: 13, submitted: false })
        ])
      });
      expect(results).toEqual(new Set([11, 13]));
    });

    it('getAllGroupedByTaskId should return ', () => {
      const results = TaskEduContentQueries.getAllGroupedByTaskId({
        taskEduContents: createState([
          new TaskEduContentFixture({ id: 1, taskId: 11, submitted: false }),
          new TaskEduContentFixture({ id: 2, taskId: 11, submitted: true }),
          new TaskEduContentFixture({ id: 3, taskId: 12, submitted: false })
        ])
      });
      expect(results).toEqual({
        11: [
          new TaskEduContentFixture({ id: 1, taskId: 11, submitted: false }),
          new TaskEduContentFixture({ id: 2, taskId: 11, submitted: true })
        ],
        12: [new TaskEduContentFixture({ id: 3, taskId: 12, submitted: false })]
      });
    });

    it('getAllByTaskId should return ', () => {
      const results = TaskEduContentQueries.getAllByTaskId(
        {
          taskEduContents: createState([
            new TaskEduContentFixture({ id: 1, taskId: 11, submitted: false }),
            new TaskEduContentFixture({ id: 2, taskId: 11, submitted: true }),
            new TaskEduContentFixture({ id: 3, taskId: 12, submitted: false })
          ])
        },
        { taskId: 11 }
      );
      expect(results).toEqual([
        new TaskEduContentFixture({ id: 1, taskId: 11, submitted: false }),
        new TaskEduContentFixture({ id: 2, taskId: 11, submitted: true })
      ]);
    });

    it('getByTaskAndEduContentId should return ', () => {
      const results = TaskEduContentQueries.getByTaskAndEduContentId(
        {
          taskEduContents: createState([
            new TaskEduContentFixture({ id: 1, taskId: 11, eduContentId: 12 }),
            new TaskEduContentFixture({ id: 2, taskId: 13, eduContentId: 14 })
          ])
        },
        { taskId: 11, eduContentId: 12 }
      );
      expect(results).toEqual(
        new TaskEduContentFixture({ id: 1, taskId: 11, eduContentId: 12 })
      );
    });
  });
});
