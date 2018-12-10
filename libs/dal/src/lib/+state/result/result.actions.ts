import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { ResultInterface } from '../../+models';

export enum ResultsActionTypes {
  ResultsLoaded = '[Results] Results Loaded',
  ResultsLoadError = '[Results] Load Error',
  LoadResults = '[Results] Load Results',
  AddResult = '[Results] Add Result',
  UpsertResult = '[Results] Upsert Result',
  AddResults = '[Results] Add Results',
  UpsertResults = '[Results] Upsert Results',
  UpdateResult = '[Results] Update Result',
  UpdateResults = '[Results] Update Results',
  DeleteResult = '[Results] Delete Result',
  DeleteResults = '[Results] Delete Results',
  ClearResults = '[Results] Clear Results'
}

export class LoadResults implements Action {
  readonly type = ResultsActionTypes.LoadResults;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class ResultsLoaded implements Action {
  readonly type = ResultsActionTypes.ResultsLoaded;

  constructor(public payload: { results: ResultInterface[] }) {}
}

export class ResultsLoadError implements Action {
  readonly type = ResultsActionTypes.ResultsLoadError;
  constructor(public payload: any) {}
}

export class AddResult implements Action {
  readonly type = ResultsActionTypes.AddResult;

  constructor(public payload: { result: ResultInterface }) {}
}

export class UpsertResult implements Action {
  readonly type = ResultsActionTypes.UpsertResult;

  constructor(public payload: { result: ResultInterface }) {}
}

export class AddResults implements Action {
  readonly type = ResultsActionTypes.AddResults;

  constructor(public payload: { results: ResultInterface[] }) {}
}

export class UpsertResults implements Action {
  readonly type = ResultsActionTypes.UpsertResults;

  constructor(public payload: { results: ResultInterface[] }) {}
}

export class UpdateResult implements Action {
  readonly type = ResultsActionTypes.UpdateResult;

  constructor(public payload: { result: Update<ResultInterface> }) {}
}

export class UpdateResults implements Action {
  readonly type = ResultsActionTypes.UpdateResults;

  constructor(public payload: { results: Update<ResultInterface>[] }) {}
}

export class DeleteResult implements Action {
  readonly type = ResultsActionTypes.DeleteResult;

  constructor(public payload: { id: number }) {}
}

export class DeleteResults implements Action {
  readonly type = ResultsActionTypes.DeleteResults;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearResults implements Action {
  readonly type = ResultsActionTypes.ClearResults;
}

export type ResultsActions =
  | LoadResults
  | ResultsLoaded
  | ResultsLoadError
  | AddResult
  | UpsertResult
  | AddResults
  | UpsertResults
  | UpdateResult
  | UpdateResults
  | DeleteResult
  | DeleteResults
  | ClearResults;
