import { TaskEduContentQueries } from '.';
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
  });
});
