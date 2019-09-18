import {
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  ListFormat,
  NavItem
} from '../../+external-interfaces';
import { UiAction, UiActionTypes } from './ui.actions';

/**
 * Interface for the 'Ui' data used in
 *  - UiState, and
 *  - uiReducer
 */
export const NAME = 'ui';

export interface UiState {
  loaded: boolean; // has the Ui list been loaded
  listFormat?: ListFormat;
  sideSheetOpen?: boolean;
  sideNavOpen?: boolean;
  sideNavItems?: NavItem[];
  profileMenuItems?: DropdownMenuItemInterface[];
  breadcrumbs?: BreadcrumbLinkInterface[];
}

export const initialState: UiState = {
  listFormat: ListFormat.GRID,
  sideSheetOpen: true,
  sideNavOpen: true,
  sideNavItems: [],
  profileMenuItems: [],
  breadcrumbs: [],
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
      const open = action.payload ? !!action.payload.open : !state.sideNavOpen;
      state = {
        ...state,
        sideNavOpen: open
      };
      break;
    case UiActionTypes.SetSideNavItems:
      state = {
        ...state,
        sideNavItems: action.payload.navItems
      };
      break;
    case UiActionTypes.SetProfileMenuItems:
      state = {
        ...state,
        profileMenuItems: action.payload.menuItems
      };
      break;
    case UiActionTypes.SetBreadcrumbs:
      state = {
        ...state,
        breadcrumbs: action.payload.breadcrumbs
      };
      break;
    case UiActionTypes.UpdateNavItem:
      const newSideNavArray = state.sideNavItems.map(item =>
        item.title === action.payload.navItem.title
          ? action.payload.navItem
          : item
      );
      state = {
        ...state,
        sideNavItems: newSideNavArray
      };
      break;
  }
  return state;
}
