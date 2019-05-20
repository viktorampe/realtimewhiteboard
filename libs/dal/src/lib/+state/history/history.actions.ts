import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { HistoryInterface } from '../../+models';

export enum HistoryActionTypes {
  HistoryLoaded = '[History] History Loaded',
  HistoryLoadError = '[History] Load Error',
  LoadHistory = '[History] Load History',
  AddHistory = '[History] Add History',
  UpsertHistory = '[History] Upsert History',
  UpdateHistory = '[History] Update History',
  DeleteHistory = '[History] Delete History',
  ClearHistory = '[History] Clear History'
}

export class LoadHistory implements Action {
  readonly type = HistoryActionTypes.LoadHistory;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class HistoryLoaded implements Action {
  readonly type = HistoryActionTypes.HistoryLoaded;

  constructor(public payload: { history: HistoryInterface[] }) {}
}

export class HistoryLoadError implements Action {
  readonly type = HistoryActionTypes.HistoryLoadError;
  constructor(public payload: any) {}
}

export class AddHistory implements Action {
  readonly type = HistoryActionTypes.AddHistory;

  constructor(public payload: { history: HistoryInterface }) {}
}

export class UpsertHistory implements Action {
  readonly type = HistoryActionTypes.UpsertHistory;

  constructor(public payload: { history: HistoryInterface }) {}
}

export class UpdateHistory implements Action {
  readonly type = HistoryActionTypes.UpdateHistory;

  constructor(public payload: { history: Update<HistoryInterface> }) {}
}

export class DeleteHistory implements Action {
  readonly type = HistoryActionTypes.DeleteHistory;

  constructor(public payload: { id: number }) {}
}

export class ClearHistory implements Action {
  readonly type = HistoryActionTypes.ClearHistory;
}

export type HistoryActions =
  | LoadHistory
  | HistoryLoaded
  | HistoryLoadError
  | AddHistory
  | UpsertHistory
  | UpdateHistory
  | DeleteHistory
  | ClearHistory;
