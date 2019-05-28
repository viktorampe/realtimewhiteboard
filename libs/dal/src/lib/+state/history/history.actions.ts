import { Action } from '@ngrx/store';
import { HistoryInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum HistoryActionTypes {
  HistoryLoaded = '[History] History Loaded',
  HistoryLoadError = '[History] Load Error',
  LoadHistory = '[History] Load History',
  UpsertHistory = '[History] Upsert History',
  DeleteHistory = '[History] Delete History',
  ClearHistory = '[History] Clear History',
  StartUpsertHistory = '[History] Start Upsert History'
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

export class UpsertHistory implements Action {
  readonly type = HistoryActionTypes.UpsertHistory;

  constructor(public payload: { history: HistoryInterface }) {}
}

export class DeleteHistory implements FeedbackTriggeringAction {
  readonly type = HistoryActionTypes.DeleteHistory;

  constructor(
    public payload: {
      id: number;
      userId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class ClearHistory implements Action {
  readonly type = HistoryActionTypes.ClearHistory;
}

export class StartUpsertHistory implements Action {
  readonly type = HistoryActionTypes.StartUpsertHistory;

  constructor(public payload: { history: HistoryInterface }) {}
}

export type HistoryActions =
  | LoadHistory
  | HistoryLoaded
  | HistoryLoadError
  | UpsertHistory
  | DeleteHistory
  | ClearHistory
  | StartUpsertHistory;
