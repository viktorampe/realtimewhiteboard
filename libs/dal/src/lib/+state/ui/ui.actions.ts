import { ListFormat } from '@campus/ui';
import { Action } from '@ngrx/store';
import { UiState } from './ui.reducer';

export enum UiActionTypes {
  LoadUi = '[Ui] Load Ui',
  UiLoaded = '[Ui] Ui Loaded',
  UiLoadError = '[Ui] Ui Load Error',
  SaveUi = '[Ui] Ui Save to storage',
  ToggleListFormat = '[Ui] Ui Toggle list format'
}

export class LoadUi implements Action {
  readonly type = UiActionTypes.LoadUi;
}

export class UiLoadError implements Action {
  readonly type = UiActionTypes.UiLoadError;
  constructor(public payload: any) {}
}

export class UiLoaded implements Action {
  readonly type = UiActionTypes.UiLoaded;
  constructor(public payload: UiState) {}
}

export class SaveUi implements Action {
  readonly type = UiActionTypes.SaveUi;
}

export class ToggleListFormatUi implements Action {
  readonly type = UiActionTypes.ToggleListFormat;
  constructor(public payload: { listFormat: ListFormat }) {}
}

export type UiAction =
  | LoadUi
  | UiLoaded
  | UiLoadError
  | SaveUi
  | ToggleListFormatUi;

export const fromUiActions = {
  LoadUi,
  UiLoaded,
  UiLoadError,
  SaveUi,
  ToggleListFormatUi
};
