import { Update } from '@ngrx/entity';
import {LinkedPersonActions } from '.';
import { initialState, reducer, State } from './linked-person.reducer';
import { LinkedPersonInterface } from '../../+models';

/** 
 * This file is scaffolded, but needs some special attention:
 * - find and replace '__EXTRA__PROPERTY_NAME' and replace this with a property name of the LinkedPerson entity.
 * - set the initial property value via '[__EXTRA__PROPERTY_NAME]InitialValue'.
 * - set the updated property value via '[__EXTRA__PROPERTY_NAME]UpdatedValue'.
*/
const __EXTRA__PROPERTY_NAMEInitialValue = ;
const __EXTRA__PROPERTY_NAMEUpdatedValue = ;

/**
 * Creates a LinkedPerson.
 * @param {number} id
 * @returns {LinkedPersonInterface}
 */
function createLinkedPerson(id: number, __EXTRA__PROPERTY_NAME:any = __EXTRA__PROPERTY_NAMEInitialValue): LinkedPersonInterface | any {
  return {
    id: id,
    __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAME
  };
}

/**
 * Utility to create the linked-person state.
 *
 * @param {LinkedPersonInterface[]} linkedPersons
 * @param {boolean} [loaded]
 * @param {*} [error]
 * @returns {State}
 */
function createState(
  linkedPersons: LinkedPersonInterface[],
  loaded: boolean = false,
  error?: any
): State {
  const state: any = {
    ids: linkedPersons ? linkedPersons.map(linkedPerson => linkedPerson.id) : [],
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
  let linkedPersons: LinkedPersonInterface[];
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
      const action = new LinkedPersonActions.LinkedPersonsLoaded({ linkedPersons });
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
      const action = new LinkedPersonActions.AddLinkedPersons({ linkedPersons });
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

    
      const updatedLinkedPerson = createLinkedPerson(linkedPersons[0].id, 'test');
     
      const action = new LinkedPersonActions.UpsertLinkedPerson({
        linkedPerson: updatedLinkedPerson
      });

      const result = reducer(startState, action);

      expect(result.entities[updatedLinkedPerson.id]).toEqual(updatedLinkedPerson);
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

      expect(result).toEqual(
        createState(linkedPersonsToInsert)
      );
    });
  });

  describe('update actions', () => {
    it('should update an linkedPerson', () => {
      const linkedPerson = linkedPersons[0];
      const startState = createState([linkedPerson]);
      const update: Update<LinkedPersonInterface> = {
        id: 1,
        changes: {
          __EXTRA__PROPERTY_NAME: __EXTRA__PROPERTY_NAMEUpdatedValue
        } 
      };
      const action = new LinkedPersonActions.UpdateLinkedPerson({
        linkedPerson: update
      });
      const result = reducer(startState, action);
      expect(result).toEqual(createState([createLinkedPerson(1, __EXTRA__PROPERTY_NAMEUpdatedValue)]));
    });

    it('should update multiple linkedPersons', () => {
      const startState = createState(linkedPersons);
      const updates: Update<LinkedPersonInterface>[] = [
        
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
      const action = new LinkedPersonActions.UpdateLinkedPersons({
        linkedPersons: updates
      });
      const result = reducer(startState, action);

      expect(result).toEqual(
        createState([createLinkedPerson(1, __EXTRA__PROPERTY_NAMEUpdatedValue), createLinkedPerson(2, __EXTRA__PROPERTY_NAMEUpdatedValue), linkedPersons[2]])
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
      const startState = createState(linkedPersons, true, 'something went wrong');
      const action = new LinkedPersonActions.ClearLinkedPersons();
      const result = reducer(startState, action);
      expect(result).toEqual(createState([], true, 'something went wrong'));
    });
  });
});
