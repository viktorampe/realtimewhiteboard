import { PersonInterface } from '../../+models';
import { UserAction, UserActionTypes } from './user.actions';

/**
 * Interface for the 'User' data used in
 *  - UserState, and
 *  - userReducer
 *
 *  Note: replace if already defined in another module
 */

export const NAME = 'user';

export interface State {
  currentUser: PersonInterface; // user object
  loaded: boolean; // has the User list been loaded
  error?: any; // last none error (if any)
}

export const initialState: State = {
  currentUser: null,
  loaded: false,
  error: null
};

export function reducer(
  state: State = initialState,
  action: UserAction
): State {
  switch (action.type) {
    case UserActionTypes.UserLoaded: {
      state = {
        ...state,
        currentUser: action.payload,
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
        currentUser: null,
        loaded: false
      };
      break;
    }
    case UserActionTypes.UserRemoveError: {
      state = {
        ...state,
        error: action.payload
      };
      break;
    }
    case UserActionTypes.UpdateUser: {
      state = {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload.changedProps,
          ...{ password: null }
        }
      };
    }
  }
  return state;
}
