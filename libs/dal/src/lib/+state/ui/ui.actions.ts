import { ListFormat } from '@campus/ui';
import { Action } from '@ngrx/store';
import { UiState } from './ui.reducer';

export enum UiActionTypes {
  LoadUi = '[Ui] Load Ui',
  UiLoaded = '[Ui] Ui Loaded',
  SaveUi = '[Ui] Ui Save To Storage',
  SetListFormat = '[Ui] Ui Set List Format',
  ToggleSideSheet = '[Ui] Ui Toggle Side Sheet',
  ToggleSideNav = '[Ui] Ui Toggle Side Nav'
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
}

export type UiAction =
  | LoadUi
  | UiLoaded
  | SaveUi
  | SetListFormat
  | ToggleSideSheet
  | ToggleSideNav;

export const fromUiActions = {
  LoadUi,
  UiLoaded,
  SaveUi,
  SetListFormat,
  ToggleSideSheet,
  ToggleSideNav
};
