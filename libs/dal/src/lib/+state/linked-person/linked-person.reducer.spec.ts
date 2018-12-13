import { Update } from '@ngrx/entity';
import { LinkedPersonActions } from '.';
import { TeacherStudentInterface } from '../../+models';
import { initialState, reducer, State } from './linked-person.reducer';

/**
 * This file is scaffolded, but needs some special attention:
 * - find and replace 'teacherId' and replace this with a property name of the LinkedPerson entity.
 * - set the initial property value via '[teacherId]InitialValue'.
 * - set the updated property value via '[teacherId]UpdatedValue'.
 */
const teacherIdInitialValue = 1;
const teacherIdUpdatedValue = 2;

/**
 * Creates a LinkedPerson.
 * @param {number} id
 * @returns {TeacherStudentInterface}
 */
function createLinkedPerson(
  id: number,
  teacherId: any = teacherIdInitialValue
): TeacherStudentInterface | any {
  return {
    id: id,
    teacherId: teacherId
  };
}

/**
 * Utility to create the linked-person state.
 *
 * @param {TeacherStudentInterface[]} linkedPersons
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  linkedPersons: TeacherStudentInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: linkedPersons
      ? linkedPersons.map(linkedPerson => linkedPerson.id)
      : [],
    entities: linkedPersons
      ? linkedPersons.reduce(
          (entityMap, linkedPerson) => ({
            ...entityMap,
            [linkedPerson.id]: linkedPerson
          }),
          {}
        )
      : {},
    loaded: loaded
  };
  if (error !== undefined) state.error = error;
  return state;
}

describe('LinkedPersons Reducer', () => {
  let linkedPersons: TeacherStudentInterface[];
  beforeEach(() => {
    linkedPersons = [
      createLinkedPerson(1),
      createLinkedPerson(2),
      createLinkedPerson(3)
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
    it('should load all linkedPersons', () => {
      const action = new LinkedPersonActions.LinkedPersonsLoaded({
        linkedPersons
      });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(linkedPersons, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LinkedPersonActions.LinkedPersonsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one linkedPerson', () => {
      const linkedPerson = linkedPersons[0];
      const action = new LinkedPersonActions.AddLinkedPerson({
        linkedPerson
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([linkedPerson], false));
    });

    it('should add multiple linkedPersons', () => {
      const action = new LinkedPersonActions.AddLinkedPersons({
        linkedPersons
      });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(linkedPersons, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one linkedPerson', () => {
      const originalLinkedPerson = linkedPersons[0];

      const startState = reducer(
        initialState,
        new LinkedPersonActions.AddLinkedPerson({
          linkedPerson: originalLinkedPerson
        })
      );

      const updatedLinkedPerson = createLinkedPerson(
        linkedPersons[0].id,
        'test'
      );

      const action = new LinkedPersonActions.UpsertLinkedPerson({
        linkedPerson: updatedLinkedPerson
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedLinkedPerson.id]).toEqual(
        updatedLinkedPerson
      );
    });

    it('should upsert many linkedPersons', () => {
      const startState = createState(linkedPersons);

      const linkedPersonsToInsert = [
        createLinkedPerson(1),
        createLinkedPerson(2),
        createLinkedPerson(3),
        createLinkedPerson(4)
      ];
      const action = new LinkedPersonActions.UpsertLinkedPersons({
        linkedPersons: linkedPersonsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(linkedPersonsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an linkedPerson', () => {
      const linkedPerson = linkedPersons[0];
      const startState = createState([linkedPerson]);
      const update: Update<TeacherStudentInterface> = {
        id: 1,
        changes: {
          teacherId: teacherIdUpdatedValue
        }
      };
      const action = new LinkedPersonActions.UpdateLinkedPerson({
        linkedPerson: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(
        createState([createLinkedPerson(1, teacherIdUpdatedValue)])
      );
    });

    it('should update multiple linkedPersons', () => {
      const startState = createState(linkedPersons);
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
      const action = new LinkedPersonActions.UpdateLinkedPersons({
        linkedPersons: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createLinkedPerson(1, teacherIdUpdatedValue),
          createLinkedPerson(2, teacherIdUpdatedValue),
          linkedPersons[2]
        ])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one linkedPerson ', () => {
      const linkedPerson = linkedPersons[0];
      const startState = createState([linkedPerson]);
      const action = new LinkedPersonActions.DeleteLinkedPerson({
        id: linkedPerson.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple linkedPersons', () => {
      const startState = createState(linkedPersons);
      const action = new LinkedPersonActions.DeleteLinkedPersons({
        ids: [linkedPersons[0].id, linkedPersons[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([linkedPersons[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the linkedPersons collection', () => {
      const startState = createState(
        linkedPersons,
        true,
        'something went wrong'
      );
      const action = new LinkedPersonActions.ClearLinkedPersons();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
