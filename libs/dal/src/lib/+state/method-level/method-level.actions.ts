import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { MethodLevelInterface } from '../../+models';

export enum MethodLevelsActionTypes {
  MethodLevelsLoaded = '[MethodLevels] MethodLevels Loaded',
  MethodLevelsLoadError = '[MethodLevels] Load Error',
  LoadMethodLevels = '[MethodLevels] Load MethodLevels',
  AddMethodLevel = '[MethodLevels] Add MethodLevel',
  UpsertMethodLevel = '[MethodLevels] Upsert MethodLevel',
  AddMethodLevels = '[MethodLevels] Add MethodLevels',
  UpsertMethodLevels = '[MethodLevels] Upsert MethodLevels',
  UpdateMethodLevel = '[MethodLevels] Update MethodLevel',
  UpdateMethodLevels = '[MethodLevels] Update MethodLevels',
  DeleteMethodLevel = '[MethodLevels] Delete MethodLevel',
  DeleteMethodLevels = '[MethodLevels] Delete MethodLevels',
  ClearMethodLevels = '[MethodLevels] Clear MethodLevels'
}

export class LoadMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.LoadMethodLevels;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class MethodLevelsLoaded implements Action {
  readonly type = MethodLevelsActionTypes.MethodLevelsLoaded;

  constructor(public payload: { methodLevels: MethodLevelInterface[] }) {}
}

export class MethodLevelsLoadError implements Action {
  readonly type = MethodLevelsActionTypes.MethodLevelsLoadError;
  constructor(public payload: any) {}
}

export class AddMethodLevel implements Action {
  readonly type = MethodLevelsActionTypes.AddMethodLevel;

  constructor(public payload: { methodLevel: MethodLevelInterface }) {}
}

export class UpsertMethodLevel implements Action {
  readonly type = MethodLevelsActionTypes.UpsertMethodLevel;

  constructor(public payload: { methodLevel: MethodLevelInterface }) {}
}

export class AddMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.AddMethodLevels;

  constructor(public payload: { methodLevels: MethodLevelInterface[] }) {}
}

export class UpsertMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.UpsertMethodLevels;

  constructor(public payload: { methodLevels: MethodLevelInterface[] }) {}
}

export class UpdateMethodLevel implements Action {
  readonly type = MethodLevelsActionTypes.UpdateMethodLevel;

  constructor(public payload: { methodLevel: Update<MethodLevelInterface> }) {}
}

export class UpdateMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.UpdateMethodLevels;

  constructor(public payload: { methodLevels: Update<MethodLevelInterface>[] }) {}
}

export class DeleteMethodLevel implements Action {
  readonly type = MethodLevelsActionTypes.DeleteMethodLevel;

  constructor(public payload: { id: number }) {}
}

export class DeleteMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.DeleteMethodLevels;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.ClearMethodLevels;
}

export type MethodLevelsActions =
  | LoadMethodLevels
  | MethodLevelsLoaded
  | MethodLevelsLoadError
  | AddMethodLevel
  | UpsertMethodLevel
  | AddMethodLevels
  | UpsertMethodLevels
  | UpdateMethodLevel
  | UpdateMethodLevels
  | DeleteMethodLevel
  | DeleteMethodLevels
  | ClearMethodLevels;
