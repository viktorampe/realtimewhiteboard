import { Update } from '@ngrx/entity';
import { TaskStudentInterface } from '../../+models';
import {
  addTaskStudent,
  addTaskStudents,
  clearTaskStudents,
  deleteTaskStudent,
  deleteTaskStudents,
  taskStudentsLoaded,
  taskStudentsLoadError,
  updateTaskStudent,
  updateTaskStudents,
  upsertTaskStudent,
  upsertTaskStudents
} from './task-student.actions';
import { initialState, reducer, State } from './task-student.reducer';

const taskIdInitialValue = 1;
const taskIdUpdatedValue = 2;

/**
 * Creates a TaskStudent.
 * @param {number} id
 * @returns {TaskStudentInterface}
 */
function createTaskStudent(
  id: number,
  taskId: any = taskIdInitialValue
): TaskStudentInterface | any {
  return {
    id: id,
    taskId: taskId
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
      const action = taskStudentsLoaded({
        taskStudents
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(taskStudents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = taskStudentsLoadError({ error });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one taskStudent', () => {
      const taskStudent = taskStudents[0];
      const action = addTaskStudent({
        taskStudent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([taskStudent], false));
    });

    it('should add multiple taskStudents', () => {
      const action = addTaskStudents({ taskStudents });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(taskStudents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one taskStudent', () => {
      const originalTaskStudent = taskStudents[0];

      const startState = reducer(
        initialState,
        addTaskStudent({
          taskStudent: originalTaskStudent
        })
      );

      const updatedTaskStudent = createTaskStudent(taskStudents[0].id, 'test');

      const action = upsertTaskStudent({
        taskStudent: updatedTaskStudent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedTaskStudent.id]).toEqual(
        updatedTaskStudent
      );
    });

    it('should upsert many taskStudents', () => {
      const startState = createState(taskStudents);

      const taskStudentsToInsert = [
        createTaskStudent(1),
        createTaskStudent(2),
        createTaskStudent(3),
        createTaskStudent(4)
      ];
      const action = upsertTaskStudents({
        taskStudents: taskStudentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(taskStudentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an taskStudent', () => {
      const taskStudent = taskStudents[0];
      const startState = createState([taskStudent]);
      const update: Update<TaskStudentInterface> = {
        id: 1,
        changes: {
          taskId: taskIdUpdatedValue
        }
      };
      const action = updateTaskStudent({
        taskStudent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createTaskStudent(1, taskIdUpdatedValue)])
      );
    });

    it('should update multiple taskStudents', () => {
      const startState = createState(taskStudents);
      const updates: Update<TaskStudentInterface>[] = [
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
      const action = updateTaskStudents({
        taskStudents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createTaskStudent(1, taskIdUpdatedValue),
          createTaskStudent(2, taskIdUpdatedValue),
          taskStudents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one taskStudent ', () => {
      const taskStudent = taskStudents[0];
      const startState = createState([taskStudent]);
      const action = deleteTaskStudent({
        id: taskStudent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple taskStudents', () => {
      const startState = createState(taskStudents);
      const action = deleteTaskStudents({
        ids: [taskStudents[0].id, taskStudents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([taskStudents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the taskStudents collection', () => {
      const startState = createState(
        taskStudents,
        true,
        'something went wrong'
      );
      const action = clearTaskStudents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
