import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { UnlockedBoekeGroupInterface } from '../../+models';

export enum UnlockedBoekeGroupsActionTypes {
  UnlockedBoekeGroupsLoaded = '[UnlockedBoekeGroups] UnlockedBoekeGroups Loaded',
  UnlockedBoekeGroupsLoadError = '[UnlockedBoekeGroups] Load Error',
  LoadUnlockedBoekeGroups = '[UnlockedBoekeGroups] Load UnlockedBoekeGroups',
  AddUnlockedBoekeGroup = '[UnlockedBoekeGroups] Add UnlockedBoekeGroup',
  UpsertUnlockedBoekeGroup = '[UnlockedBoekeGroups] Upsert UnlockedBoekeGroup',
  AddUnlockedBoekeGroups = '[UnlockedBoekeGroups] Add UnlockedBoekeGroups',
  UpsertUnlockedBoekeGroups = '[UnlockedBoekeGroups] Upsert UnlockedBoekeGroups',
  UpdateUnlockedBoekeGroup = '[UnlockedBoekeGroups] Update UnlockedBoekeGroup',
  UpdateUnlockedBoekeGroups = '[UnlockedBoekeGroups] Update UnlockedBoekeGroups',
  DeleteUnlockedBoekeGroup = '[UnlockedBoekeGroups] Delete UnlockedBoekeGroup',
  DeleteUnlockedBoekeGroups = '[UnlockedBoekeGroups] Delete UnlockedBoekeGroups',
  ClearUnlockedBoekeGroups = '[UnlockedBoekeGroups] Clear UnlockedBoekeGroups'
}

export class LoadUnlockedBoekeGroups implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.LoadUnlockedBoekeGroups;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class UnlockedBoekeGroupsLoaded implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.UnlockedBoekeGroupsLoaded;

  constructor(
    public payload: { unlockedBoekeGroups: UnlockedBoekeGroupInterface[] }
  ) {}
}

export class UnlockedBoekeGroupsLoadError implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.UnlockedBoekeGroupsLoadError;
  constructor(public payload: any) {}
}

export class AddUnlockedBoekeGroup implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.AddUnlockedBoekeGroup;

  constructor(
    public payload: { unlockedBoekeGroup: UnlockedBoekeGroupInterface }
  ) {}
}

export class UpsertUnlockedBoekeGroup implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.UpsertUnlockedBoekeGroup;

  constructor(
    public payload: { unlockedBoekeGroup: UnlockedBoekeGroupInterface }
  ) {}
}

export class AddUnlockedBoekeGroups implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.AddUnlockedBoekeGroups;

  constructor(
    public payload: { unlockedBoekeGroups: UnlockedBoekeGroupInterface[] }
  ) {}
}

export class UpsertUnlockedBoekeGroups implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.UpsertUnlockedBoekeGroups;

  constructor(
    public payload: { unlockedBoekeGroups: UnlockedBoekeGroupInterface[] }
  ) {}
}

export class UpdateUnlockedBoekeGroup implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.UpdateUnlockedBoekeGroup;

  constructor(
    public payload: { unlockedBoekeGroup: Update<UnlockedBoekeGroupInterface> }
  ) {}
}

export class UpdateUnlockedBoekeGroups implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.UpdateUnlockedBoekeGroups;

  constructor(
    public payload: {
      unlockedBoekeGroups: Update<UnlockedBoekeGroupInterface>[];
    }
  ) {}
}

export class DeleteUnlockedBoekeGroup implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.DeleteUnlockedBoekeGroup;

  constructor(public payload: { id: number }) {}
}

export class DeleteUnlockedBoekeGroups implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.DeleteUnlockedBoekeGroups;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearUnlockedBoekeGroups implements Action {
  readonly type = UnlockedBoekeGroupsActionTypes.ClearUnlockedBoekeGroups;
}

export type UnlockedBoekeGroupsActions =
  | LoadUnlockedBoekeGroups
  | UnlockedBoekeGroupsLoaded
  | UnlockedBoekeGroupsLoadError
  | AddUnlockedBoekeGroup
  | UpsertUnlockedBoekeGroup
  | AddUnlockedBoekeGroups
  | UpsertUnlockedBoekeGroups
  | UpdateUnlockedBoekeGroup
  | UpdateUnlockedBoekeGroups
  | DeleteUnlockedBoekeGroup
  | DeleteUnlockedBoekeGroups
  | ClearUnlockedBoekeGroups;
