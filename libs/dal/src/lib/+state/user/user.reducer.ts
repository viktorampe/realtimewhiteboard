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
  lastUpdateMessage?: {
    message: string;
    timeStamp: number;
    type: 'success' | 'error';
  };
  loaded: boolean; // has the User list been loaded
  error?: any; // last none error (if any)
  permissions: string[];
  permissionsLoaded: boolean; // have the permissions been load for the user
  permissionsError?: any; // last none error (if any)
}

export const initialState: State = {
  currentUser: null,
  lastUpdateMessage: null,
  loaded: false,
  error: null,
  permissions: [],
  permissionsLoaded: false,
  permissionsError: null
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
        loaded: false,
        permissions: [],
        permissionsLoaded: false
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
      //remove password from the properties
      const { password, ...props } = action.payload.changedProps;
      state = {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...props
        }
      };
      break;
    }
    case UserActionTypes.UserUpdateMessage: {
      state = {
        ...state,
        lastUpdateMessage: action.payload
      };
      break;
    }

    case UserActionTypes.PermissionsLoaded: {
      state = {
        ...state,
        permissions: action.payload,
        permissionsLoaded: true
      };
      break;
    }
    case UserActionTypes.PermissionsLoadError: {
      state = {
        ...state,
        permissionsError: action.payload
      };
      break;
    }
  }
  return state;
}
