import { Update } from '@ngrx/entity';
import { StudentContentStatusActions } from '.';
import { StudentContentStatusInterface } from '../../+models';
import { initialState, reducer, State } from './student-content-status.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the StudentContentStatus entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a StudentContentStatus.
 * @param {number} id
 * @returns {StudentContentStatusInterface}
 */
function createStudentContentStatus(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): StudentContentStatusInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the student-content-status state.
 *
 * @param {StudentContentStatusInterface[]} StudentContentStatuses
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  StudentContentStatuses: StudentContentStatusInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: StudentContentStatuses ? StudentContentStatuses.map(studentContentStatus => studentContentStatus.id) : [],
    entities: StudentContentStatuses
      ? StudentContentStatuses.reduce(
          (entityMap, studentContentStatus) => ({
            ...entityMap,
            [studentContentStatus.id]: studentContentStatus
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}


describe('StudentContentStatuses Reducer', () => {
  let StudentContentStatuses: StudentContentStatusInterface[];
  beforeEach(() => {
    StudentContentStatuses = [
      createStudentContentStatus(1),
      createStudentContentStatus(2),
      createStudentContentStatus(3)
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
    it('should load all StudentContentStatuses', () => {
      const action = new StudentContentStatusActions.StudentContentStatusesLoaded({ StudentContentStatuses });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(StudentContentStatuses, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new StudentContentStatusActions.StudentContentStatusesLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one studentContentStatus', () => {
      const studentContentStatus = StudentContentStatuses[0];
      const action = new StudentContentStatusActions.AddStudentContentStatus({
        studentContentStatus
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([studentContentStatus], false));
    });

    it('should add multiple StudentContentStatuses', () => {
      const action = new StudentContentStatusActions.AddStudentContentStatuses({ StudentContentStatuses });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(StudentContentStatuses, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one studentContentStatus', () => {
      const originalStudentContentStatus = StudentContentStatuses[0];

      const startState = reducer(
        initialState,
        new StudentContentStatusActions.AddStudentContentStatus({
          studentContentStatus: originalStudentContentStatus
        })
      );


      const updatedStudentContentStatus = createStudentContentStatus(StudentContentStatuses[0].id, 'test');

      const action = new StudentContentStatusActions.UpsertStudentContentStatus({
        studentContentStatus: updatedStudentContentStatus
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedStudentContentStatus.id]).toEqual(updatedStudentContentStatus);
    });

    it('should upsert many StudentContentStatuses', () => {
      const startState = createState(StudentContentStatuses);

      const StudentContentStatusesToInsert = [
        createStudentContentStatus(1),
        createStudentContentStatus(2),
        createStudentContentStatus(3),
        createStudentContentStatus(4)
      ];
      const action = new StudentContentStatusActions.UpsertStudentContentStatuses({
        StudentContentStatuses: StudentContentStatusesToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(StudentContentStatusesToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an studentContentStatus', () => {
      const studentContentStatus = StudentContentStatuses[0];
      const startState = createState([studentContentStatus]);
      const update: Update<StudentContentStatusInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        }
      };
      const action = new StudentContentStatusActions.UpdateStudentContentStatus({
        studentContentStatus: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createStudentContentStatus(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple StudentContentStatuses', () => {
      const startState = createState(StudentContentStatuses);
      const updates: Update<StudentContentStatusInterface>[] = [

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
      const action = new StudentContentStatusActions.UpdateStudentContentStatuses({
        StudentContentStatuses: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createStudentContentStatus(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createStudentContentStatus(2, __EXTRA__PROPERTY_NAMEUpdatedValue), StudentContentStatuses[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one studentContentStatus ', () => {
      const studentContentStatus = StudentContentStatuses[0];
      const startState = createState([studentContentStatus]);
      const action = new StudentContentStatusActions.DeleteStudentContentStatus({
        id: studentContentStatus.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple StudentContentStatuses', () => {
      const startState = createState(StudentContentStatuses);
      const action = new StudentContentStatusActions.DeleteStudentContentStatuses({
        ids: [StudentContentStatuses[0].id, StudentContentStatuses[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([StudentContentStatuses[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the StudentContentStatuses collection', () => {
      const startState = createState(StudentContentStatuses, true, 'something went wrong');
      const action = new StudentContentStatusActions.ClearStudentContentStatuses();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
