import { Update } from '@ngrx/entity';
import { TeacherStudentActions } from '.';
import { TeacherStudentInterface } from '../../+models';
import { initialState, reducer, State } from './teacher-student.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'teacherId' and replace this with a property name of the teacherStudent entity.
 * - set the initial property value via '[teacherId]InitialValue'.
 * - set the updated property value via '[teacherId]UpdatedValue'.
 */
const teacherIdInitialValue = 1;
const teacherIdUpdatedValue = 2;

/**
 * Creates a teacherStudent.
 * @param {number} id
 * @returns {TeacherStudentInterface}
 */
function createteacherStudent(
  id: number,
  teacherId: any = teacherIdInitialValue
): TeacherStudentInterface | any {
  return {
    id: id,
    teacherId: teacherId
  };
}

/**
 * Utility to create the teacher-student state.
 *
 * @param {TeacherStudentInterface[]} teacherStudents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  teacherStudents: TeacherStudentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: teacherStudents
      ? teacherStudents.map(teacherStudent => teacherStudent.id)
      : [],
    entities: teacherStudents
      ? teacherStudents.reduce(
          (entityMap, teacherStudent) => ({
            ...entityMap,
            [teacherStudent.id]: teacherStudent
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('teacherStudents Reducer', () => {
  let teacherStudents: TeacherStudentInterface[];
  beforeEach(() => {
    teacherStudents = [
      createteacherStudent(1),
      createteacherStudent(2),
      createteacherStudent(3)
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
    it('should load all teacherStudents', () => {
      const action = new TeacherStudentActions.TeacherStudentsLoaded({
        teacherStudents
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(teacherStudents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new TeacherStudentActions.TeacherStudentsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one teacherStudent', () => {
      const teacherStudent = teacherStudents[0];
      const action = new TeacherStudentActions.AddTeacherStudent({
        teacherStudent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([teacherStudent], false));
    });

    it('should add multiple teacherStudents', () => {
      const action = new TeacherStudentActions.AddTeacherStudents({
        teacherStudents
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(teacherStudents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one teacherStudent', () => {
      const originalteacherStudent = teacherStudents[0];

      const startState = reducer(
        initialState,
        new TeacherStudentActions.AddTeacherStudent({
          teacherStudent: originalteacherStudent
        })
      );

      const updatedteacherStudent = createteacherStudent(
        teacherStudents[0].id,
        'test'
      );

      const action = new TeacherStudentActions.UpsertTeacherStudent({
        teacherStudent: updatedteacherStudent
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedteacherStudent.id]).toEqual(
        updatedteacherStudent
      );
    });

    it('should upsert many teacherStudents', () => {
      const startState = createState(teacherStudents);

      const teacherStudentsToInsert = [
        createteacherStudent(1),
        createteacherStudent(2),
        createteacherStudent(3),
        createteacherStudent(4)
      ];
      const action = new TeacherStudentActions.UpsertTeacherStudents({
        teacherStudents: teacherStudentsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(teacherStudentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an teacherStudent', () => {
      const teacherStudent = teacherStudents[0];
      const startState = createState([teacherStudent]);
      const update: Update<TeacherStudentInterface> = {
        id: 1,
        changes: {
          teacherId: teacherIdUpdatedValue
        }
      };
      const action = new TeacherStudentActions.UpdateTeacherStudent({
        teacherStudent: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createteacherStudent(1, teacherIdUpdatedValue)])
      );
    });

    it('should update multiple teacherStudents', () => {
      const startState = createState(teacherStudents);
      const updates: Update<TeacherStudentInterface>[] = [
        {
          id: 1,
          changes: {
            teacherId: teacherIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            teacherId: teacherIdUpdatedValue
          }
        }
      ];
      const action = new TeacherStudentActions.UpdateTeacherStudents({
        teacherStudents: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createteacherStudent(1, teacherIdUpdatedValue),
          createteacherStudent(2, teacherIdUpdatedValue),
          teacherStudents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one teacherStudent ', () => {
      const teacherStudent = teacherStudents[0];
      const startState = createState([teacherStudent]);
      const action = new TeacherStudentActions.DeleteTeacherStudent({
        id: teacherStudent.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple teacherStudents', () => {
      const startState = createState(teacherStudents);
      const action = new TeacherStudentActions.DeleteTeacherStudents({
        ids: [teacherStudents[0].id, teacherStudents[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([teacherStudents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the teacherStudents collection', () => {
      const startState = createState(
        teacherStudents,
        true,
        'something went wrong'
      );
      const action = new TeacherStudentActions.ClearTeacherStudents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
