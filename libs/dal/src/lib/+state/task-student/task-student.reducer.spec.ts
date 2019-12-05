import { Update } from '@ngrx/entity';
import {TaskStudentActions } from '.';
import { initialState, reducer, State } from './task-student.reducer';
import { TaskStudentInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the TaskStudent entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a TaskStudent.
 * @param {number} id
 * @returns {TaskStudentInterface}
 */
function createTaskStudent(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): TaskStudentInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the task-student state.
 *
 * @param {TaskStudentInterface[]} taskStudents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  taskStudents: TaskStudentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: taskStudents ? taskStudents.map(taskStudent => taskStudent.id) : [],
    entities: taskStudents
      ? taskStudents.reduce(
          (entityMap, taskStudent) => ({
            ...entityMap,
            [taskStudent.id]: taskStudent
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('TaskStudents Reducer', () => {
  let taskStudents: TaskStudentInterface[];
  beforeEach(() => {
    taskStudents = [
      createTaskStudent(1),
      createTaskStudent(2),
      createTaskStudent(3)
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
    it('should load all taskStudents', () => {
      const action = new TaskStudentActions.TaskStudentsLoaded({ taskStudents });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskStudents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TaskStudentActions.TaskStudentsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskStudent', () => {
      const taskStudent = taskStudents[0];
      const action = new TaskStudentActions.AddTaskStudent({
        taskStudent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskStudent], false));
    });

    it('should add multiple taskStudents', () => {
      const action = new TaskStudentActions.AddTaskStudents({ taskStudents });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskStudents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskStudent', () => {
      const originalTaskStudent = taskStudents[0];
      
      const startState = reducer(
        initialState,
        new TaskStudentActions.AddTaskStudent({
          taskStudent: originalTaskStudent
        })
      );

    
      const updatedTaskStudent = createTaskStudent(taskStudents[0].id, 'test');
     
      const action = new TaskStudentActions.UpsertTaskStudent({
        taskStudent: updatedTaskStudent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskStudent.id]).toEqual(updatedTaskStudent);
    });

    it('should upsert many taskStudents', () => {
      const startState = createState(taskStudents);

      const taskStudentsToInsert = [
        createTaskStudent(1),
        createTaskStudent(2),
        createTaskStudent(3),
        createTaskStudent(4)
      ];
      const action = new TaskStudentActions.UpsertTaskStudents({
        taskStudents: taskStudentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(taskStudentsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an taskStudent', () => {
      const taskStudent = taskStudents[0];
      const startState = createState([taskStudent]);
      const update: Update<TaskStudentInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new TaskStudentActions.UpdateTaskStudent({
        taskStudent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createTaskStudent(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple taskStudents', () => {
      const startState = createState(taskStudents);
      const updates: Update<TaskStudentInterface>[] = [
        
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
      const action = new TaskStudentActions.UpdateTaskStudents({
        taskStudents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createTaskStudent(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createTaskStudent(2, __EXTRA__PROPERTY_NAMEUpdatedValue), taskStudents[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskStudent ', () => {
      const taskStudent = taskStudents[0];
      const startState = createState([taskStudent]);
      const action = new TaskStudentActions.DeleteTaskStudent({
        id: taskStudent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskStudents', () => {
      const startState = createState(taskStudents);
      const action = new TaskStudentActions.DeleteTaskStudents({
        ids: [taskStudents[0].id, taskStudents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskStudents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskStudents collection', () => {
      const startState = createState(taskStudents, true, 'something went wrong');
      const action = new TaskStudentActions.ClearTaskStudents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
