import { ListFormat } from '@campus/ui';
import { UiAction, UiActionTypes } from './ui.actions';

/**
 * Interface for the 'Ui' data used in
 *  - UiState, and
 *  - uiReducer
 */
export const NAME = 'ui';

export interface UiState {
  loaded: boolean; // has the Ui list been loaded
  listFormat?: string;
  sideSheetOpen?: boolean;
  sideNavOpen?: boolean;
}

export const initialState: UiState = {
  listFormat: ListFormat.GRID,
  sideSheetOpen: true,
  sideNavOpen: true,
  loaded: false
};

export function reducer(
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
    case UiActionTypes.ToggleSideNav:
      state = {
        ...state,
        sideNavOpen: !state.sideNavOpen
      };
      break;
  }
  return state;
}
