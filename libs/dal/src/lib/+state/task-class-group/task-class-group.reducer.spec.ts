import { Update } from '@ngrx/entity';
import {TaskClassGroupActions } from '.';
import { initialState, reducer, State } from './task-class-group.reducer';
import { TaskClassGroupInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the TaskClassGroup entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a TaskClassGroup.
 * @param {number} id
 * @returns {TaskClassGroupInterface}
 */
function createTaskClassGroup(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): TaskClassGroupInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
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
    ids: taskClassGroups ? taskClassGroups.map(taskClassGroup => taskClassGroup.id) : [],
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
      const action = new TaskClassGroupActions.TaskClassGroupsLoaded({ taskClassGroups });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskClassGroups, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TaskClassGroupActions.TaskClassGroupsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskClassGroup', () => {
      const taskClassGroup = taskClassGroups[0];
      const action = new TaskClassGroupActions.AddTaskClassGroup({
        taskClassGroup
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskClassGroup], false));
    });

    it('should add multiple taskClassGroups', () => {
      const action = new TaskClassGroupActions.AddTaskClassGroups({ taskClassGroups });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskClassGroups, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskClassGroup', () => {
      const originalTaskClassGroup = taskClassGroups[0];
      
      const startState = reducer(
        initialState,
        new TaskClassGroupActions.AddTaskClassGroup({
          taskClassGroup: originalTaskClassGroup
        })
      );

    
      const updatedTaskClassGroup = createTaskClassGroup(taskClassGroups[0].id, 'test');
     
      const action = new TaskClassGroupActions.UpsertTaskClassGroup({
        taskClassGroup: updatedTaskClassGroup
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskClassGroup.id]).toEqual(updatedTaskClassGroup);
    });

    it('should upsert many taskClassGroups', () => {
      const startState = createState(taskClassGroups);

      const taskClassGroupsToInsert = [
        createTaskClassGroup(1),
        createTaskClassGroup(2),
        createTaskClassGroup(3),
        createTaskClassGroup(4)
      ];
      const action = new TaskClassGroupActions.UpsertTaskClassGroups({
        taskClassGroups: taskClassGroupsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(taskClassGroupsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an taskClassGroup', () => {
      const taskClassGroup = taskClassGroups[0];
      const startState = createState([taskClassGroup]);
      const update: Update<TaskClassGroupInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new TaskClassGroupActions.UpdateTaskClassGroup({
        taskClassGroup: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createTaskClassGroup(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple taskClassGroups', () => {
      const startState = createState(taskClassGroups);
      const updates: Update<TaskClassGroupInterface>[] = [
        
        {
          id: 1,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          } 
        },
        {
          id: 2,
          changes: {
            __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
          }  
        }
      ];
      const action = new TaskClassGroupActions.UpdateTaskClassGroups({
        taskClassGroups: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createTaskClassGroup(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createTaskClassGroup(2, __EXTRA__PROPERTY_NAMEUpdatedValue), taskClassGroups[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskClassGroup ', () => {
      const taskClassGroup = taskClassGroups[0];
      const startState = createState([taskClassGroup]);
      const action = new TaskClassGroupActions.DeleteTaskClassGroup({
        id: taskClassGroup.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskClassGroups', () => {
      const startState = createState(taskClassGroups);
      const action = new TaskClassGroupActions.DeleteTaskClassGroups({
        ids: [taskClassGroups[0].id, taskClassGroups[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskClassGroups[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskClassGroups collection', () => {
      const startState = createState(taskClassGroups, true, 'something went wrong');
      const action = new TaskClassGroupActions.ClearTaskClassGroups();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
