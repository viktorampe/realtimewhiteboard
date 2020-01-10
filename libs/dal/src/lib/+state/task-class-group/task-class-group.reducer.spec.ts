import { Update } from '@ngrx/entity';
import { TaskClassGroupInterface } from '../../+models';
import {
  addTaskClassGroup,
  addTaskClassGroups,
  clearTaskClassGroups,
  deleteTaskClassGroup,
  deleteTaskClassGroups,
  taskClassGroupsLoaded,
  taskClassGroupsLoadError,
  updateTaskClassGroup,
  updateTaskClassGroups,
  upsertTaskClassGroup,
  upsertTaskClassGroups
} from './task-class-group.actions';
import { initialState, reducer, State } from './task-class-group.reducer';

const taskIdInitialValue = 123;
const taskIdUpdatedValue = 456;

/**
 * Creates a TaskClassGroup.
 * @param {number} id
 * @returns {TaskClassGroupInterface}
 */
function createTaskClassGroup(
  id: number,
  taskId: any = taskIdInitialValue
): TaskClassGroupInterface | any {
  return {
    id: id,
    taskId: taskId
  };
}

/**
 * Utility to create the task-class-group state.
 *
 * @param {TaskClassGroupInterface[]} taskClassGroups
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  taskClassGroups: TaskClassGroupInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('TaskClassGroups Reducer', () => {
  let taskClassGroups: TaskClassGroupInterface[];
  beforeEach(() => {
    taskClassGroups = [
      createTaskClassGroup(1),
      createTaskClassGroup(2),
      createTaskClassGroup(3)
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
    it('should load all taskClassGroups', () => {
      const action = taskClassGroupsLoaded({
        taskClassGroups
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskClassGroups, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = taskClassGroupsLoadError({ error });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskClassGroup', () => {
      const taskClassGroup = taskClassGroups[0];
      const action = addTaskClassGroup({
        taskClassGroup
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskClassGroup], false));
    });

    it('should add multiple taskClassGroups', () => {
      const action = addTaskClassGroups({
        taskClassGroups
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskClassGroups, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskClassGroup', () => {
      const originalTaskClassGroup = taskClassGroups[0];

      const startState = reducer(
        initialState,
        addTaskClassGroup({
          taskClassGroup: originalTaskClassGroup
        })
      );

      const updatedTaskClassGroup = createTaskClassGroup(
        taskClassGroups[0].id,
        'test'
      );

      const action = upsertTaskClassGroup({
        taskClassGroup: updatedTaskClassGroup
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskClassGroup.id]).toEqual(
        updatedTaskClassGroup
      );
    });

    it('should upsert many taskClassGroups', () => {
      const startState = createState(taskClassGroups);

      const taskClassGroupsToInsert = [
        createTaskClassGroup(1),
        createTaskClassGroup(2),
        createTaskClassGroup(3),
        createTaskClassGroup(4)
      ];
      const action = upsertTaskClassGroups({
        taskClassGroups: taskClassGroupsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(taskClassGroupsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an taskClassGroup', () => {
      const taskClassGroup = taskClassGroups[0];
      const startState = createState([taskClassGroup]);
      const update: Update<TaskClassGroupInterface> = {
        id: 1,
        changes: {
          taskId: taskIdUpdatedValue
        }
      };
      const action = updateTaskClassGroup({
        taskClassGroup: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createTaskClassGroup(1, taskIdUpdatedValue)])
      );
    });

    it('should update multiple taskClassGroups', () => {
      const startState = createState(taskClassGroups);
      const updates: Update<TaskClassGroupInterface>[] = [
        {
          id: 1,
          changes: {
            taskId: taskIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            taskId: taskIdUpdatedValue
          }
        }
      ];
      const action = updateTaskClassGroups({
        taskClassGroups: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createTaskClassGroup(1, taskIdUpdatedValue),
          createTaskClassGroup(2, taskIdUpdatedValue),
          taskClassGroups[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskClassGroup ', () => {
      const taskClassGroup = taskClassGroups[0];
      const startState = createState([taskClassGroup]);
      const action = deleteTaskClassGroup({
        id: taskClassGroup.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskClassGroups', () => {
      const startState = createState(taskClassGroups);
      const action = deleteTaskClassGroups({
        ids: [taskClassGroups[0].id, taskClassGroups[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskClassGroups[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskClassGroups collection', () => {
      const startState = createState(
        taskClassGroups,
        true,
        'something went wrong'
      );
      const action = clearTaskClassGroups();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
