import { Update } from '@ngrx/entity';
import { TaskEduContentActions } from '.';
import { TaskEduContentInterface } from '../../+models';
import { initialState, reducer, State } from './task-edu-content.reducer';

const indexInitialValue = 1;
const indexUpdatedValue = 1;

/**
 * Creates a TaskEduContent.
 * @param {number} id
 * @returns {TaskEduContentInterface}
 */
function createTaskEduContent(
  id: number,
  index: any = indexInitialValue
): TaskEduContentInterface | any {
  return {
    id: id,
    index: index
  };
}

/**
 * Utility to create the task-edu-content state.
 *
 * @param {TaskEduContentInterface[]} taskEduContents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  taskEduContents: TaskEduContentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('TaskEduContents Reducer', () => {
  let taskEduContents: TaskEduContentInterface[];
  beforeEach(() => {
    taskEduContents = [
      createTaskEduContent(1),
      createTaskEduContent(2),
      createTaskEduContent(3)
    ];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all taskEduContents', () => {
      const action = new TaskEduContentActions.TaskEduContentsLoaded({
        taskEduContents
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskEduContents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TaskEduContentActions.TaskEduContentsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskEduContent', () => {
      const taskEduContent = taskEduContents[0];
      const action = new TaskEduContentActions.AddTaskEduContent({
        taskEduContent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskEduContent], false));
    });

    it('should add multiple taskEduContents', () => {
      const action = new TaskEduContentActions.AddTaskEduContents({
        taskEduContents
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskEduContents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskEduContent', () => {
      const originalTaskEduContent = taskEduContents[0];

      const startState = reducer(
        initialState,
        new TaskEduContentActions.AddTaskEduContent({
          taskEduContent: originalTaskEduContent
        })
      );

      const updatedTaskEduContent = createTaskEduContent(
        taskEduContents[0].id,
        'test'
      );

      const action = new TaskEduContentActions.UpsertTaskEduContent({
        taskEduContent: updatedTaskEduContent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskEduContent.id]).toEqual(
        updatedTaskEduContent
      );
    });

    it('should upsert many taskEduContents', () => {
      const startState = createState(taskEduContents);

      const taskEduContentsToInsert = [
        createTaskEduContent(1),
        createTaskEduContent(2),
        createTaskEduContent(3),
        createTaskEduContent(4)
      ];
      const action = new TaskEduContentActions.UpsertTaskEduContents({
        taskEduContents: taskEduContentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(taskEduContentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an taskEduContent', () => {
      const taskEduContent = taskEduContents[0];
      const startState = createState([taskEduContent]);
      const update: Update<TaskEduContentInterface> = {
        id: 1,
        changes: {
          index: indexUpdatedValue
        }
      };
      const action = new TaskEduContentActions.UpdateTaskEduContent({
        taskEduContent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createTaskEduContent(1, indexUpdatedValue)])
      );
    });

    it('should update multiple taskEduContents', () => {
      const startState = createState(taskEduContents);
      const updates: Update<TaskEduContentInterface>[] = [
        {
          id: 1,
          changes: {
            index: indexUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            index: indexUpdatedValue
          }
        }
      ];
      const action = new TaskEduContentActions.UpdateTaskEduContents({
        taskEduContents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createTaskEduContent(1, indexUpdatedValue),
          createTaskEduContent(2, indexUpdatedValue),
          taskEduContents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskEduContent ', () => {
      const taskEduContent = taskEduContents[0];
      const startState = createState([taskEduContent]);
      const action = new TaskEduContentActions.DeleteTaskEduContent({
        id: taskEduContent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskEduContents', () => {
      const startState = createState(taskEduContents);
      const action = new TaskEduContentActions.DeleteTaskEduContents({
        ids: [taskEduContents[0].id, taskEduContents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskEduContents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskEduContents collection', () => {
      const startState = createState(
        taskEduContents,
        true,
        'something went wrong'
      );
      const action = new TaskEduContentActions.ClearTaskEduContents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
