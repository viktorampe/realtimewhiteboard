import { Update } from '@ngrx/entity';
import { StudentContentStatusActions } from '.';
import { StudentContentStatusInterface } from '../../+models';
import { initialState, reducer, State } from './student-content-status.reducer';

const personIdInitialValue = 1;
const personIdUpdatedValue = 2;

/**
 * Creates a StudentContentStatus.
 * @param {number} id
 * @returns {StudentContentStatusInterface}
 */
function createStudentContentStatus(
  id: number,
  personId: any = personIdInitialValue
): StudentContentStatusInterface | any {
  return {
    id: id,
    personId: personId
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
    ids: StudentContentStatuses
      ? StudentContentStatuses.map(
          studentContentStatus => studentContentStatus.id
        )
      : [],
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
  let studentContentStatuses: StudentContentStatusInterface[];
  beforeEach(() => {
    studentContentStatuses = [
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
      const action = new StudentContentStatusActions.StudentContentStatusesLoaded(
        { studentContentStatuses }
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(studentContentStatuses, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new StudentContentStatusActions.StudentContentStatusesLoadError(
        error
      );
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one studentContentStatus', () => {
      const studentContentStatus = studentContentStatuses[0];
      const action = new StudentContentStatusActions.StudentContentStatusAdded({
        studentContentStatus
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([studentContentStatus], false));
    });

    it('should add multiple StudentContentStatuses', () => {
      const action = new StudentContentStatusActions.AddStudentContentStatuses({
        studentContentStatuses
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(studentContentStatuses, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one studentContentStatus', () => {
      const originalStudentContentStatus = studentContentStatuses[0];

      const startState = reducer(
        initialState,
        new StudentContentStatusActions.AddStudentContentStatus({
          studentContentStatus: originalStudentContentStatus
        })
      );

      const updatedStudentContentStatus = createStudentContentStatus(
        studentContentStatuses[0].id,
        'test'
      );

      const action = new StudentContentStatusActions.StudentContentStatusUpserted(
        {
          studentContentStatus: updatedStudentContentStatus
        }
      );

      const result = reducer(startState, action);

      expect(result.entities[updatedStudentContentStatus.id]).toEqual(
        updatedStudentContentStatus
      );
    });

    it('should upsert many StudentContentStatuses', () => {
      const startState = createState(studentContentStatuses);

      const StudentContentStatusesToInsert = [
        createStudentContentStatus(1),
        createStudentContentStatus(2),
        createStudentContentStatus(3),
        createStudentContentStatus(4)
      ];
      const action = new StudentContentStatusActions.UpsertStudentContentStatuses(
        {
          studentContentStatuses: StudentContentStatusesToInsert
        }
      );

      const result = reducer(startState, action);

      expect(result).toEqual(createState(StudentContentStatusesToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an studentContentStatus', () => {
      const studentContentStatus = studentContentStatuses[0];
      const startState = createState([studentContentStatus]);
      const update: Update<StudentContentStatusInterface> = {
        id: 1,
        changes: {
          personId: personIdUpdatedValue
        }
      };
      const action = new StudentContentStatusActions.StudentContentStatusUpdated(
        {
          studentContentStatus: update
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createStudentContentStatus(1, personIdUpdatedValue)])
      );
    });

    it('should update multiple StudentContentStatuses', () => {
      const startState = createState(studentContentStatuses);
      const updates: Update<StudentContentStatusInterface>[] = [
        {
          id: 1,
          changes: {
            personId: personIdUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            personId: personIdUpdatedValue
          }
        }
      ];
      const action = new StudentContentStatusActions.UpdateStudentContentStatuses(
        {
          studentContentStatuses: updates
        }
      );
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createStudentContentStatus(1, personIdUpdatedValue),
          createStudentContentStatus(2, personIdUpdatedValue),
          studentContentStatuses[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one studentContentStatus ', () => {
      const studentContentStatus = studentContentStatuses[0];
      const startState = createState([studentContentStatus]);
      const action = new StudentContentStatusActions.DeleteStudentContentStatus(
        {
          id: studentContentStatus.id
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple StudentContentStatuses', () => {
      const startState = createState(studentContentStatuses);
      const action = new StudentContentStatusActions.DeleteStudentContentStatuses(
        {
          ids: [studentContentStatuses[0].id, studentContentStatuses[1].id]
        }
      );
      const result = reducer(startState, action);
      expect(result).toEqual(createState([studentContentStatuses[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the StudentContentStatuses collection', () => {
      const startState = createState(
        studentContentStatuses,
        true,
        'something went wrong'
      );
      const action = new StudentContentStatusActions.ClearStudentContentStatuses();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
