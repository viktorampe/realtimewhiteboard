import { Action } from '@ngrx/store';
import {
  BreadcrumbLinkInterface,
  DropdownMenuItemInterface,
  ListFormat,
  NavItem
} from '../../+external-interfaces';
import { UiState } from './ui.reducer';

export enum UiActionTypes {
  LoadUi = '[Ui] Load Ui',
  UiLoaded = '[Ui] Ui Loaded',
  SaveUi = '[Ui] Ui Save To Storage',
  SetListFormat = '[Ui] Ui Set List Format',
  ToggleSideSheet = '[Ui] Ui Toggle Side Sheet',
  ToggleSideNav = '[Ui] Ui Toggle Side Nav',
  SetSideNavItems = '[Ui] Ui Set Side Nav Items',
  SetProfileMenuItems = '[Ui] Ui Set Profile Menu Items',
  SetBreadcrumbs = '[Ui] Ui Set Breadcrumbs',
  UpdateNavItem = '[Ui] Ui Update NavItem'
}

export class LoadUi implements Action {
  readonly type = UiActionTypes.LoadUi;
}

export class UiLoaded implements Action {
  readonly type = UiActionTypes.UiLoaded;
  constructor(public payload: { state: UiState }) {}
}

export class SaveUi implements Action {
  readonly type = UiActionTypes.SaveUi;
}

export class SetListFormat implements Action {
  readonly type = UiActionTypes.SetListFormat;
  constructor(public payload: { listFormat: ListFormat }) {}
}

export class ToggleSideSheet implements Action {
  readonly type = UiActionTypes.ToggleSideSheet;
}

export class ToggleSideNav implements Action {
  readonly type = UiActionTypes.ToggleSideNav;
  constructor(public payload?: { open?: boolean }) {}
}

export class SetSideNavItems implements Action {
  readonly type = UiActionTypes.SetSideNavItems;
  constructor(public payload: { navItems: NavItem[] }) {}
}

export class SetProfileMenuItems implements Action {
  readonly type = UiActionTypes.SetProfileMenuItems;
  constructor(public payload: { menuItems: DropdownMenuItemInterface[] }) {}
}

export class SetBreadcrumbs implements Action {
  readonly type = UiActionTypes.SetBreadcrumbs;
  constructor(public payload: { breadcrumbs: BreadcrumbLinkInterface[] }) {}
}

export class UpdateNavItem implements Action {
  readonly type = UiActionTypes.UpdateNavItem;
  constructor(public payload: { navItem: NavItem }) {}
}

export type UiAction =
  | LoadUi
  | UiLoaded
  | SaveUi
  | SetListFormat
  | ToggleSideSheet
  | ToggleSideNav
  | SetSideNavItems
  | SetProfileMenuItems
  | SetBreadcrumbs
  | UpdateNavItem;

export const fromUiActions = {
  LoadUi,
  UiLoaded,
  SaveUi,
  SetListFormat,
  ToggleSideSheet,
  ToggleSideNav,
  SetSideNavItems,
  SetProfileMenuItems,
  SetBreadcrumbs,
  UpdateNavItem
};
