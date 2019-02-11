import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { MethodInterface } from '../../+models';

export enum MethodsActionTypes {
  MethodsLoaded = '[Methods] Methods Loaded',
  MethodsLoadError = '[Methods] Load Error',
  LoadMethods = '[Methods] Load Methods',
  AddMethod = '[Methods] Add Method',
  UpsertMethod = '[Methods] Upsert Method',
  AddMethods = '[Methods] Add Methods',
  UpsertMethods = '[Methods] Upsert Methods',
  UpdateMethod = '[Methods] Update Method',
  UpdateMethods = '[Methods] Update Methods',
  DeleteMethod = '[Methods] Delete Method',
  DeleteMethods = '[Methods] Delete Methods',
  ClearMethods = '[Methods] Clear Methods'
}

export class LoadMethods implements Action {
  readonly type = MethodsActionTypes.LoadMethods;

  constructor(public payload: { force?: boolean } = {}) {}
}

export class MethodsLoaded implements Action {
  readonly type = MethodsActionTypes.MethodsLoaded;

  constructor(public payload: { methods: MethodInterface[] }) {}
}

export class MethodsLoadError implements Action {
  readonly type = MethodsActionTypes.MethodsLoadError;
  constructor(public payload: any) {}
}

export class AddMethod implements Action {
  readonly type = MethodsActionTypes.AddMethod;

  constructor(public payload: { method: MethodInterface }) {}
}

export class UpsertMethod implements Action {
  readonly type = MethodsActionTypes.UpsertMethod;

  constructor(public payload: { method: MethodInterface }) {}
}

export class AddMethods implements Action {
  readonly type = MethodsActionTypes.AddMethods;

  constructor(public payload: { methods: MethodInterface[] }) {}
}

export class UpsertMethods implements Action {
  readonly type = MethodsActionTypes.UpsertMethods;

  constructor(public payload: { methods: MethodInterface[] }) {}
}

export class UpdateMethod implements Action {
  readonly type = MethodsActionTypes.UpdateMethod;

  constructor(public payload: { method: Update<MethodInterface> }) {}
}

export class UpdateMethods implements Action {
  readonly type = MethodsActionTypes.UpdateMethods;

  constructor(public payload: { methods: Update<MethodInterface>[] }) {}
}

export class DeleteMethod implements Action {
  readonly type = MethodsActionTypes.DeleteMethod;

  constructor(public payload: { id: number }) {}
}

export class DeleteMethods implements Action {
  readonly type = MethodsActionTypes.DeleteMethods;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearMethods implements Action {
  readonly type = MethodsActionTypes.ClearMethods;
}

export type MethodsActions =
  | LoadMethods
  | MethodsLoaded
  | MethodsLoadError
  | AddMethod
  | UpsertMethod
  | AddMethods
  | UpsertMethods
  | UpdateMethod
  | UpdateMethods
  | DeleteMethod
  | DeleteMethods
  | ClearMethods;
