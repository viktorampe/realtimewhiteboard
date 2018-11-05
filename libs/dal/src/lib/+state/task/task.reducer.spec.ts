import { Update } from '@ngrx/entity';
import {TaskActions } from '.';
import { initialState, reducer, State } from './task.reducer';
import { TaskInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Task entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Task.
 * @param {number} id
 * @returns {TaskInterface}
 */
function createTask(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): TaskInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the task state.
 *
 * @param {TaskInterface[]} tasks
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  tasks: TaskInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
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
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('Tasks Reducer', () => {
  let tasks: TaskInterface[];
  beforeEach(() => {
    tasks = [
      createTask(1),
      createTask(2),
      createTask(3)
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
    it('should load all tasks', () => {
      const action = new TaskActions.TasksLoaded({ tasks });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(tasks, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TaskActions.TasksLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one task', () => {
      const task = tasks[0];
      const action = new TaskActions.AddTask({
        task
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([task], false));
    });

    it('should add multiple tasks', () => {
      const action = new TaskActions.AddTasks({ tasks });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(tasks, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one task', () => {
      const originalTask = tasks[0];
      
      const startState = reducer(
        initialState,
        new TaskActions.AddTask({
          task: originalTask
        })
      );

    
      const updatedTask = createTask(tasks[0].id, 'test');
     
      const action = new TaskActions.UpsertTask({
        task: updatedTask
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTask.id]).toEqual(updatedTask);
    });

    it('should upsert many tasks', () => {
      const startState = createState(tasks);

      const tasksToInsert = [
        createTask(1),
        createTask(2),
        createTask(3),
        createTask(4)
      ];
      const action = new TaskActions.UpsertTasks({
        tasks: tasksToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(tasksToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an task', () => {
      const task = tasks[0];
      const startState = createState([task]);
      const update: Update<TaskInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new TaskActions.UpdateTask({
        task: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createTask(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple tasks', () => {
      const startState = createState(tasks);
      const updates: Update<TaskInterface>[] = [
        
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
      const action = new TaskActions.UpdateTasks({
        tasks: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createTask(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createTask(2, __EXTRA__PROPERTY_NAMEUpdatedValue), tasks[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one task ', () => {
      const task = tasks[0];
      const startState = createState([task]);
      const action = new TaskActions.DeleteTask({
        id: task.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple tasks', () => {
      const startState = createState(tasks);
      const action = new TaskActions.DeleteTasks({
        ids: [tasks[0].id, tasks[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([tasks[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the tasks collection', () => {
      const startState = createState(tasks, true, 'something went wrong');
      const action = new TaskActions.ClearTasks();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
