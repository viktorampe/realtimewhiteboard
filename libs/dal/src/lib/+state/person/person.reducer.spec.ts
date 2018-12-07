import { Update } from '@ngrx/entity';
import {PersonActions } from '.';
import { initialState, reducer, State } from './person.reducer';
import { PersonInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the Person entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a Person.
 * @param {number} id
 * @returns {PersonInterface}
 */
function createPerson(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): PersonInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
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
    persons = [
      createPerson(1),
      createPerson(2),
      createPerson(3)
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
    it('should load all persons', () => {
      const action = new PersonActions.PersonsLoaded({ persons });
      const result = reducer(initialState, action);
      expect(result).toEqual(createState(persons, true));
    });

    it('should error', () => {
      const error = 'Something went wrong';
      const action = new PersonActions.PersonsLoadError(error);
      const result = reducer(initialState, action);
      expect(result).toEqual(createState([], false, error));
    });
  });

  describe('add actions', () => {
    it('should add one person', () => {
      const person = persons[0];
      const action = new PersonActions.AddPerson({
        person
      });

      const result = reducer(initialState, action);
      expect(result).toEqual(createState([person], false));
    });

    it('should add multiple persons', () => {
      const action = new PersonActions.AddPersons({ persons });
      const result = reducer(initialState, action);

      expect(result).toEqual(createState(persons, false));
    });
  });
  describe('upsert actions', () => {
    it('should upsert one person', () => {
      const originalPerson = persons[0];
      
      const startState = reducer(
        initialState,
        new PersonActions.AddPerson({
          person: originalPerson
        })
      );

    
      const updatedPerson = createPerson(persons[0].id, 'test');
     
      const action = new PersonActions.UpsertPerson({
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
      const action = new PersonActions.UpsertPersons({
        persons: personsToInsert
      });

      const result = reducer(startState, action);

      expect(result).toEqual(
        createState(personsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an person', () => {
      const person = persons[0];
      const startState = createState([person]);
      const update: Update<PersonInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new PersonActions.UpdatePerson({
        person: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createPerson(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple persons', () => {
      const startState = createState(persons);
      const updates: Update<PersonInterface>[] = [
        
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
      const action = new PersonActions.UpdatePersons({
        persons: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createPerson(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createPerson(2, __EXTRA__PROPERTY_NAMEUpdatedValue), persons[2]])
      );
    });
  });

  describe('delete actions', () => {
    it('should delete one person ', () => {
      const person = persons[0];
      const startState = createState([person]);
      const action = new PersonActions.DeletePerson({
        id: person.id
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([]));
    });

    it('should delete multiple persons', () => {
      const startState = createState(persons);
      const action = new PersonActions.DeletePersons({
        ids: [persons[0].id, persons[1].id]
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([persons[2]]));
    });
  });

  describe('clear action', () => {
    it('should clear the persons collection', () => {
      const startState = createState(persons, true, 'something went wrong');
      const action = new PersonActions.ClearPersons();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
