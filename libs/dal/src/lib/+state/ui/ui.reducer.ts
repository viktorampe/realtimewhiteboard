import { UiAction, UiActionTypes } from './ui.actions';

/**
 * Interface for the 'Ui' data used in
 *  - UiState, and
 *  - uiReducer
 */

export interface UiState {
  loaded: boolean; // has the Ui list been loaded
  listFormat?: string;
  sideSheetOpen?: boolean;
}

export const initialState: UiState = {
  loaded: false
};

export function uiReducer(
  state: UiState = initialState,
  action: UiAction
): UiState {
  switch (action.type) {
    case UiActionTypes.UiLoaded:
      state = {
        ...state,
        ...action.payload.state,
        loaded: true
      };
      break;
    case UiActionTypes.SetListFormat:
      state = {
        ...state,
        listFormat: action.payload.listFormat
      };
      break;
    case UiActionTypes.ToggleSideSheet:
      state = {
        ...state,
        sideSheetOpen: !state.sideSheetOpen
      };
      break;
  }
  return state;
}
