import { UserAction, UserActionTypes } from './user.actions';

/**
 * Interface for the 'User' data used in
 *  - UserState, and
 *  - userReducer
 *
 *  Note: replace if already defined in another module
 */

export interface UserState {
  list: any; // list of User; analogous to a sql normalized table
  selectedId?: string | number; // which User record has been selected
  loaded: boolean; // has the User list been loaded
  error?: any; // last none error (if any)
}

export const initialUserstate: UserState = {
  list: {},
  loaded: false
};

export function userReducer(
  state: UserState = initialUserstate,
  action: UserAction
): UserState {
  switch (action.type) {
    case UserActionTypes.UserLoaded: {
      state = {
        ...state,
        list: action.payload,
        loaded: true
      };
      break;
    }
    case UserActionTypes.UserLoadError: {
      state = {
        ...state,
        error: action.payload
      };
      break;
    }
    case UserActionTypes.UserRemoved: {
      state = {
        ...state,
        list: [],
        loaded: false
      };
      break;
    }
    case UserActionTypes.UserRemoveError: {
      state = {
        ...state,
        error: action.payload
      };
    }
  }
  return state;
}
