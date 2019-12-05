import { Update } from '@ngrx/entity';
import { TaskGroupActions } from '.';
import { TaskGroupInterface } from '../../+models';
import { initialState, reducer, State } from './task-group.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the TaskGroup entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
 */
const groupIdInitialValue = 1;
const groudIdUpdatedValue = 2;

/**
 * Creates a TaskGroup.
 * @param {number} id
 * @returns {TaskGroupInterface}
 */
function createTaskGroup(
  id: number,
  groupId: any = groupIdInitialValue
): TaskGroupInterface | any {
  return {
    id: id,
    groupId: groupId
  };
}

/**
 * Utility to create the task-group state.
 *
 * @param {TaskGroupInterface[]} taskGroups
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  taskGroups: TaskGroupInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('TaskGroups Reducer', () => {
  let taskGroups: TaskGroupInterface[];
  beforeEach(() => {
    taskGroups = [createTaskGroup(1), createTaskGroup(2), createTaskGroup(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all taskGroups', () => {
      const action = new TaskGroupActions.TaskGroupsLoaded({ taskGroups });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskGroups, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TaskGroupActions.TaskGroupsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskGroup', () => {
      const taskGroup = taskGroups[0];
      const action = new TaskGroupActions.AddTaskGroup({
        taskGroup
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskGroup], false));
    });

    it('should add multiple taskGroups', () => {
      const action = new TaskGroupActions.AddTaskGroups({ taskGroups });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskGroups, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskGroup', () => {
      const originalTaskGroup = taskGroups[0];

      const startState = reducer(
        initialState,
        new TaskGroupActions.AddTaskGroup({
          taskGroup: originalTaskGroup
        })
      );

      const updatedTaskGroup = createTaskGroup(taskGroups[0].id, 'test');

      const action = new TaskGroupActions.UpsertTaskGroup({
        taskGroup: updatedTaskGroup
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskGroup.id]).toEqual(updatedTaskGroup);
    });

    it('should upsert many taskGroups', () => {
      const startState = createState(taskGroups);

      const taskGroupsToInsert = [
        createTaskGroup(1),
        createTaskGroup(2),
        createTaskGroup(3),
        createTaskGroup(4)
      ];
      const action = new TaskGroupActions.UpsertTaskGroups({
        taskGroups: taskGroupsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(taskGroupsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an taskGroup', () => {
      const taskGroup = taskGroups[0];
      const startState = createState([taskGroup]);
      const update: Update<TaskGroupInterface> = {
        id: 1,
        changes: {
          groupId: groudIdUpdatedValue
        }
      };
      const action = new TaskGroupActions.UpdateTaskGroup({
        taskGroup: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createTaskGroup(1, groudIdUpdatedValue)])
      );
    });

    it('should update multiple taskGroups', () => {
      const startState = createState(taskGroups);
      const updates: Update<TaskGroupInterface>[] = [
        {
          id: 1,
          changes: {
            groupId: groudIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            groupId: groudIdUpdatedValue
          }
        }
      ];
      const action = new TaskGroupActions.UpdateTaskGroups({
        taskGroups: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createTaskGroup(1, groudIdUpdatedValue),
          createTaskGroup(2, groudIdUpdatedValue),
          taskGroups[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskGroup ', () => {
      const taskGroup = taskGroups[0];
      const startState = createState([taskGroup]);
      const action = new TaskGroupActions.DeleteTaskGroup({
        id: taskGroup.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskGroups', () => {
      const startState = createState(taskGroups);
      const action = new TaskGroupActions.DeleteTaskGroups({
        ids: [taskGroups[0].id, taskGroups[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskGroups[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskGroups collection', () => {
      const startState = createState(taskGroups, true, 'something went wrong');
      const action = new TaskGroupActions.ClearTaskGroups();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
