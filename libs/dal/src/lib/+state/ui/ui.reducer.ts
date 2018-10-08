import { UiAction, UiActionTypes } from './ui.actions';

/**
 * Interface for the 'Ui' data used in
 *  - UiState, and
 *  - uiReducer
 *
 *  Note: replace if already defined in another module
 */

export interface UiState {
  loaded: boolean; // has the Ui list been loaded
  error?: any; // last none error (if any)
}

export const initialState: UiState = {
  loaded: false
};

export function uiReducer(
  state: UiState = initialState,
  action: UiAction
): UiState {
  switch (action.type) {
    case UiActionTypes.UiLoadError:
      state = {
        ...state,
        loaded: false
      };
      break;
    case UiActionTypes.UiLoaded:
      state = {
        ...state,
        loaded: true
      };
      break;
  }
  return state;
}
