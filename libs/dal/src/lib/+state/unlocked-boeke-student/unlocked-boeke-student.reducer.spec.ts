import { Update } from '@ngrx/entity';
import { UnlockedBoekeStudentActions } from '.';
import { UnlockedBoekeStudentInterface } from '../../+models';
import { initialState, reducer, State } from './unlocked-boeke-student.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'name' and replace this with a property name of the UnlockedBoekeStudent entity.
 * - set the initial property value via '[name]InitialValue'.
 * - set the updated property value via '[name]UpdatedValue'.
 */
const studentIdInitialValue = 1;
const studentIdUpdatedValue = 2;

/**
 * Creates a UnlockedBoekeStudent.
 * @param {number} id
 * @returns {UnlockedBoekeStudentInterface}
 */
function createUnlockedBoekeStudent(
  id: number,
  studentId: any = studentIdInitialValue
): UnlockedBoekeStudentInterface | any {
  return {
    id: id,
    studentId: studentId
  };
}

/**
 * Utility to create the unlocked-boeke-student state.
 *
 * @param {UnlockedBoekeStudentInterface[]} unlockedBoekeStudents
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  unlockedBoekeStudents: UnlockedBoekeStudentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: unlockedBoekeStudents
      ? unlockedBoekeStudents.map(
          unlockedBoekeStudent => unlockedBoekeStudent.id
        )
      : [],
    entities: unlockedBoekeStudents
      ? unlockedBoekeStudents.reduce(
          (entityMap, unlockedBoekeStudent) => ({
            ...entityMap,
            [unlockedBoekeStudent.id]: unlockedBoekeStudent
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('UnlockedBoekeStudents Reducer', () => {
  let unlockedBoekeStudents: UnlockedBoekeStudentInterface[];
  beforeEach(() => {
    unlockedBoekeStudents = [
      createUnlockedBoekeStudent(1),
      createUnlockedBoekeStudent(2),
      createUnlockedBoekeStudent(3)
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
    it('should load all unlockedBoekeStudents', () => {
      const action = new UnlockedBoekeStudentActions.UnlockedBoekeStudentsLoaded(
        { unlockedBoekeStudents }
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(unlockedBoekeStudents, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new UnlockedBoekeStudentActions.UnlockedBoekeStudentsLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one unlockedBoekeStudent', () => {
      const unlockedBoekeStudent = unlockedBoekeStudents[0];
      const action = new UnlockedBoekeStudentActions.AddUnlockedBoekeStudent({
        unlockedBoekeStudent
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([unlockedBoekeStudent], false));
    });

    it('should add multiple unlockedBoekeStudents', () => {
      const action = new UnlockedBoekeStudentActions.AddUnlockedBoekeStudents({
        unlockedBoekeStudents
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(unlockedBoekeStudents, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one unlockedBoekeStudent', () => {
      const originalUnlockedBoekeStudent = unlockedBoekeStudents[0];

      const startState = reducer(
        initialState,
        new UnlockedBoekeStudentActions.AddUnlockedBoekeStudent({
          unlockedBoekeStudent: originalUnlockedBoekeStudent
        })
      );

      const updatedUnlockedBoekeStudent = createUnlockedBoekeStudent(
        unlockedBoekeStudents[0].id,
        'test'
      );

      const action = new UnlockedBoekeStudentActions.UpsertUnlockedBoekeStudent(
        {
          unlockedBoekeStudent: updatedUnlockedBoekeStudent
        }
      );

      const result = reducer(startState, action);

      expect(result.entities[updatedUnlockedBoekeStudent.id]).toEqual(
        updatedUnlockedBoekeStudent
      );
    });

    it('should upsert many unlockedBoekeStudents', () => {
      const startState = createState(unlockedBoekeStudents);

      const unlockedBoekeStudentsToInsert = [
        createUnlockedBoekeStudent(1),
        createUnlockedBoekeStudent(2),
        createUnlockedBoekeStudent(3),
        createUnlockedBoekeStudent(4)
      ];
      const action = new UnlockedBoekeStudentActions.UpsertUnlockedBoekeStudents(
        {
          unlockedBoekeStudents: unlockedBoekeStudentsToInsert
        }
      );

      const result = reducer(startState, action);

      expect(result).toEqual(createState(unlockedBoekeStudentsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an unlockedBoekeStudent', () => {
      const unlockedBoekeStudent = unlockedBoekeStudents[0];
      const startState = createState([unlockedBoekeStudent]);
      const update: Update<UnlockedBoekeStudentInterface> = {
        id: 1,
        changes: {
          studentId: studentIdUpdatedValue
        }
      };
      const action = new UnlockedBoekeStudentActions.UpdateUnlockedBoekeStudent(
        {
          unlockedBoekeStudent: update
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createUnlockedBoekeStudent(1, studentIdUpdatedValue)])
      );
    });

    it('should update multiple unlockedBoekeStudents', () => {
      const startState = createState(unlockedBoekeStudents);
      const updates: Update<UnlockedBoekeStudentInterface>[] = [
        {
          id: 1,
          changes: {
            studentId: studentIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            studentId: studentIdUpdatedValue
          }
        }
      ];
      const action = new UnlockedBoekeStudentActions.UpdateUnlockedBoekeStudents(
        {
          unlockedBoekeStudents: updates
        }
      );
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createUnlockedBoekeStudent(1, studentIdUpdatedValue),
          createUnlockedBoekeStudent(2, studentIdUpdatedValue),
          unlockedBoekeStudents[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one unlockedBoekeStudent ', () => {
      const unlockedBoekeStudent = unlockedBoekeStudents[0];
      const startState = createState([unlockedBoekeStudent]);
      const action = new UnlockedBoekeStudentActions.DeleteUnlockedBoekeStudent(
        {
          id: unlockedBoekeStudent.id
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple unlockedBoekeStudents', () => {
      const startState = createState(unlockedBoekeStudents);
      const action = new UnlockedBoekeStudentActions.DeleteUnlockedBoekeStudents(
        {
          ids: [unlockedBoekeStudents[0].id, unlockedBoekeStudents[1].id]
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([unlockedBoekeStudents[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the unlockedBoekeStudents collection', () => {
      const startState = createState(
        unlockedBoekeStudents,
        true,
        'something went wrong'
      );
      const action = new UnlockedBoekeStudentActions.ClearUnlockedBoekeStudents();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
