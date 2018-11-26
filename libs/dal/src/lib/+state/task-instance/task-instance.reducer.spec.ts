import { Update } from '@ngrx/entity';
import { TaskInstanceActions } from '.';
import { TaskInstanceInterface } from '../../+models';
import { initialState, reducer, State } from './task-instance.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'alerted' and replace this with a property name of the TaskInstance entity.
 * - set the initial property value via '[alerted]InitialValue'.
 * - set the updated property value via '[alerted]UpdatedValue'.
 */
const alertedInitialValue = true;
const alertedUpdatedValue = false;

/**
 * Creates a TaskInstance.
 * @param {number} id
 * @returns {TaskInstanceInterface}
 */
function createTaskInstance(
  id: number,
  alerted: any = alertedInitialValue
): TaskInstanceInterface | any {
  return {
    id: id,
    alerted: alerted
  };
}

/**
 * Utility to create the task-instance state.
 *
 * @param {TaskInstanceInterface[]} taskInstances
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  taskInstances: TaskInstanceInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: taskInstances
      ? taskInstances.map(taskInstance => taskInstance.id)
      : [],
    entities: taskInstances
      ? taskInstances.reduce(
          (entityMap, taskInstance) => ({
            ...entityMap,
            [taskInstance.id]: taskInstance
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('TaskInstances Reducer', () => {
  let taskInstances: TaskInstanceInterface[];
  beforeEach(() => {
    taskInstances = [
      createTaskInstance(1),
      createTaskInstance(2),
      createTaskInstance(3)
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
    it('should load all taskInstances', () => {
      const action = new TaskInstanceActions.TaskInstancesLoaded({
        taskInstances
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskInstances, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TaskInstanceActions.TaskInstancesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskInstance', () => {
      const taskInstance = taskInstances[0];
      const action = new TaskInstanceActions.AddTaskInstance({
        taskInstance
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskInstance], false));
    });

    it('should add multiple taskInstances', () => {
      const action = new TaskInstanceActions.AddTaskInstances({
        taskInstances
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskInstances, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskInstance', () => {
      const originalTaskInstance = taskInstances[0];

      const startState = reducer(
        initialState,
        new TaskInstanceActions.AddTaskInstance({
          taskInstance: originalTaskInstance
        })
      );

      const updatedTaskInstance = createTaskInstance(
        taskInstances[0].id,
        'test'
      );

      const action = new TaskInstanceActions.UpsertTaskInstance({
        taskInstance: updatedTaskInstance
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskInstance.id]).toEqual(
        updatedTaskInstance
      );
    });

    it('should upsert many taskInstances', () => {
      const startState = createState(taskInstances);

      const taskInstancesToInsert = [
        createTaskInstance(1),
        createTaskInstance(2),
        createTaskInstance(3),
        createTaskInstance(4)
      ];
      const action = new TaskInstanceActions.UpsertTaskInstances({
        taskInstances: taskInstancesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(taskInstancesToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an taskInstance', () => {
      const taskInstance = taskInstances[0];
      const startState = createState([taskInstance]);
      const update: Update<TaskInstanceInterface> = {
        id: 1,
        changes: {
          alerted: alertedUpdatedValue
        }
      };
      const action = new TaskInstanceActions.UpdateTaskInstance({
        taskInstance: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createTaskInstance(1, alertedUpdatedValue)])
      );
    });

    it('should update multiple taskInstances', () => {
      const startState = createState(taskInstances);
      const updates: Update<TaskInstanceInterface>[] = [
        {
          id: 1,
          changes: {
            alerted: alertedUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            alerted: alertedUpdatedValue
          }
        }
      ];
      const action = new TaskInstanceActions.UpdateTaskInstances({
        taskInstances: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createTaskInstance(1, alertedUpdatedValue),
          createTaskInstance(2, alertedUpdatedValue),
          taskInstances[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskInstance ', () => {
      const taskInstance = taskInstances[0];
      const startState = createState([taskInstance]);
      const action = new TaskInstanceActions.DeleteTaskInstance({
        id: taskInstance.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskInstances', () => {
      const startState = createState(taskInstances);
      const action = new TaskInstanceActions.DeleteTaskInstances({
        ids: [taskInstances[0].id, taskInstances[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskInstances[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskInstances collection', () => {
      const startState = createState(
        taskInstances,
        true,
        'something went wrong'
      );
      const action = new TaskInstanceActions.ClearTaskInstances();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
