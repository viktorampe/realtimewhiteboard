import { Update } from '@ngrx/entity';
import { TaskActions } from '.';
import { TaskInterface } from '../../+models';
import { TeacherStudentActions } from '../teacher-student';
import { initialState, reducer, State } from './task.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'name' and replace this with a property name of the Task entity.
 * - set the initial property value via '[name]InitialValue'.
 * - set the updated property value via '[name]UpdatedValue'.
 */
const nameInitialValue = 'first this is the name';
const nameUpdatedValue = 'then this is the name';

/**
 * Creates a Task.
 * @param {number} id
 * @returns {TaskInterface}
 */
function createTask(
  id: number,
  name: any = nameInitialValue
): TaskInterface | any {
  return {
    id: id,
    name: name
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
    tasks = [createTask(1), createTask(2), createTask(3)];
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

      expect(result).toEqual(createState(tasksToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an task', () => {
      const task = tasks[0];
      const startState = createState([task]);
      const update: Update<TaskInterface> = {
        id: 1,
        changes: {
          name: nameUpdatedValue
        }
      };
      const action = new TaskActions.UpdateTask({
        task: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createTask(1, nameUpdatedValue)]));
    });

    it('should update multiple tasks', () => {
      const startState = createState(tasks);
      const updates: Update<TaskInterface>[] = [
        {
          id: 1,
          changes: {
            name: nameUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            name: nameUpdatedValue
          }
        }
      ];
      const action = new TaskActions.UpdateTasks({
        tasks: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createTask(1, nameUpdatedValue),
          createTask(2, nameUpdatedValue),
          tasks[2]
        ])
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

  describe('invalidate action', () => {
    it('should trigger from LinkTeacherStudent', () => {
      const startState = createState(tasks, true);
      const action = new TeacherStudentActions.LinkTeacherStudent({
        publicKey: 'foo',
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(tasks, false));
    });

    it('should trigger from UnlinkTeacherStudent', () => {
      const startState = createState(tasks, true);
      const action = new TeacherStudentActions.UnlinkTeacherStudent({
        teacherId: 1,
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(tasks, false));
    });
  });
});
