import { Update } from '@ngrx/entity';
import { LinkedPersonActions } from '.';
import { PersonInterface } from '../../+models';
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
 * Utility to create the person state.
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

describe('Persons Reducer', () => {
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
    it('should load all persons', () => {
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
  describe('upsert actions', () => {
    it('should upsert one person', () => {
      const originalPerson = persons[0];

      const startState = reducer(
        initialState,
        new LinkedPersonActions.AddLinkedPerson({
          person: originalPerson
        })
      );

      const updatedPerson = createPerson(persons[0].id, 'test');

      const action = new LinkedPersonActions.UpsertLinkedPerson({
        person: updatedPerson
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedPerson.id]).toEqual(updatedPerson);
    });

    it('should upsert many persons', () => {
      const startState = createState(persons);

      const personsToInsert = [
        createPerson(1),
        createPerson(2),
        createPerson(3),
        createPerson(4)
      ];
      const action = new LinkedPersonActions.UpsertLinkedPersons({
        persons: personsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(createState(personsToInsert));
    });
  });

  describe('update actions', () => {
    it('should update an person', () => {
      const person = persons[0];
      const startState = createState([person]);
      const update: Update<PersonInterface> = {
        id: 1,
        changes: {
          email: emailUpdatedValue
        }
      };
      const action = new LinkedPersonActions.UpdateLinkedPerson({
        person: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createPerson(1, emailUpdatedValue)]));
    });

    it('should update multiple persons', () => {
      const startState = createState(persons);
      const updates: Update<PersonInterface>[] = [
        {
          id: 1,
          changes: {
            email: emailUpdatedValue
          }
        },
        {
          id: 2,
          changes: {
            email: emailUpdatedValue
          }
        }
      ];
      const action = new LinkedPersonActions.UpdateLinkedPersons({
        persons: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([
          createPerson(1, emailUpdatedValue),
          createPerson(2, emailUpdatedValue),
          persons[2]
        ])
      );
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
});
