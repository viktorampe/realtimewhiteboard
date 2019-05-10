import { LinkedPersonActions } from '.';
import { PersonInterface } from '../../+models';
import { TeacherStudentActions } from '../teacher-student';
import { initialState, reducer, State } from './linked-person.reducer';

const emailInitialValue = 'foo@foo.bar';
const emailUpdatedValue = 'bar@foo.bar';

/**
 * Creates a Person.
 * @param {number} id
 * @returns {PersonInterface}
 */
function createPerson(
  id: number,
  email: any = emailInitialValue
): PersonInterface | any {
  return {
    id: id,
    email: email
  };
}

/**
 * Utility to create the linked-person state.
 *
 * @param {PersonInterface[]} persons
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  persons: PersonInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: persons ? persons.map(person => person.id) : [],
    entities: persons
      ? persons.reduce(
          (entityMap, person) => ({
            ...entityMap,
            [person.id]: person
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
  let persons: PersonInterface[];
  beforeEach(() => {
    persons = [createPerson(1), createPerson(2), createPerson(3)];
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loaded action', () => {
    it('should load all linked persons', () => {
      const action = new LinkedPersonActions.LinkedPersonsLoaded({ persons });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(persons, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new LinkedPersonActions.LinkedPersonsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one person', () => {
      const person = persons[0];
      const action = new LinkedPersonActions.AddLinkedPerson({
        person
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([person], false));
    });

    it('should add multiple persons', () => {
      const action = new LinkedPersonActions.AddLinkedPersons({ persons });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(persons, false));
    });
  });

  describe('delete actions', () => {
    it('should delete one person ', () => {
      const person = persons[0];
      const startState = createState([person]);
      const action = new LinkedPersonActions.DeleteLinkedPerson({
        id: person.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple persons', () => {
      const startState = createState(persons);
      const action = new LinkedPersonActions.DeleteLinkedPersons({
        ids: [persons[0].id, persons[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([persons[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the persons collection', () => {
      const startState = createState(persons, true, 'something went wrong');
      const action = new LinkedPersonActions.ClearLinkedPersons();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });

  describe('invalidate action', () => {
    it('should trigger from LinkTeacherStudent', () => {
      const startState = createState(persons, true);
      const action = new TeacherStudentActions.LinkTeacherStudent({
        publicKey: 'foo',
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(persons, false));
    });

    it('should trigger from UnlinkTeacherStudent', () => {
      const startState = createState(persons, true);
      const action = new TeacherStudentActions.UnlinkTeacherStudent({
        teacherId: 1,
        userId: 1
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState(persons, false));
    });
  });
});
