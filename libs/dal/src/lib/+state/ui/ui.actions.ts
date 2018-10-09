import { ListFormat } from '@campus/ui';
import { Action } from '@ngrx/store';
import { UiState } from './ui.reducer';

export enum UiActionTypes {
  LoadUi = '[Ui] Load Ui',
  UiLoaded = '[Ui] Ui Loaded',
  SaveUi = '[Ui] Ui Save To Storage',
  SetListFormat = '[Ui] Ui Set List Format',
  ToggleSideSheet = '[Ui] Ui Toggle Side Sheet'
}

export class LoadUi implements Action {
  readonly type = UiActionTypes.LoadUi;
}

export class UiLoaded implements Action {
  readonly type = UiActionTypes.UiLoaded;
  constructor(public payload: UiState) {}
}

export class SaveUi implements Action {
  readonly type = UiActionTypes.SaveUi;
}

export class SetListFormatUi implements Action {
  readonly type = UiActionTypes.SetListFormat;
  constructor(public payload: { listFormat: ListFormat }) {}
}

export class ToggleSideSheetUi implements Action {
  readonly type = UiActionTypes.ToggleSideSheet;
}

export type UiAction =
  | LoadUi
  | UiLoaded
  | SaveUi
  | SetListFormatUi
  | ToggleSideSheetUi;

export const fromUiActions = {
  LoadUi,
  UiLoaded,
  SaveUi,
  SetListFormatUi,
  ToggleSideSheetUi
};
