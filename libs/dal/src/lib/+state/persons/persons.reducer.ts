import { PersonsAction, PersonsActionTypes } from './persons.actions';

/**
 * Interface for the 'Persons' data used in
 *  - PersonsState, and
 *  - personsReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface PersonEntity {}

export interface PersonsState {
  person: PersonEntity; // list of Persons; analogous to a sql normalized table
  selectedId?: string | number; // which Persons record has been selected
  loaded: boolean; // has the Persons list been loaded
  error?: any; // last none error (if any)
  loggedIn: boolean;
}

export const initialPersonState: PersonsState = {
  person: {},
  loaded: false,
  loggedIn: false
};

export function personsReducer(
  state: PersonsState = initialPersonState,
  action: PersonsAction
): PersonsState {
  switch (action.type) {
    case PersonsActionTypes.PersonsLoaded: {
      state = {
        ...state,
        person: action.payload,
        loaded: true
      };
      break;
    }
    case PersonsActionTypes.PersonLoggedIn: {
      state = {
        ...state,
        loggedIn: action.payload
      };
      break;
    }
    case PersonsActionTypes.PersonLoggedOut: {
      state = {
        ...state,
        loggedIn: action.payload
      };
      break;
    }
  }
  return state;
}
