import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { UnlockedFreePracticeInterface } from '../../+models';

export enum UnlockedFreePracticesActionTypes {
  UnlockedFreePracticesLoaded = '[UnlockedFreePractices] UnlockedFreePractices Loaded',
  UnlockedFreePracticesLoadError = '[UnlockedFreePractices] Load Error',
  LoadUnlockedFreePractices = '[UnlockedFreePractices] Load UnlockedFreePractices',
  AddUnlockedFreePractice = '[UnlockedFreePractices] Add UnlockedFreePractice',
  UpsertUnlockedFreePractice = '[UnlockedFreePractices] Upsert UnlockedFreePractice',
  AddUnlockedFreePractices = '[UnlockedFreePractices] Add UnlockedFreePractices',
  UpsertUnlockedFreePractices = '[UnlockedFreePractices] Upsert UnlockedFreePractices',
  UpdateUnlockedFreePractice = '[UnlockedFreePractices] Update UnlockedFreePractice',
  UpdateUnlockedFreePractices = '[UnlockedFreePractices] Update UnlockedFreePractices',
  DeleteUnlockedFreePractice = '[UnlockedFreePractices] Delete UnlockedFreePractice',
  DeleteUnlockedFreePractices = '[UnlockedFreePractices] Delete UnlockedFreePractices',
  ClearUnlockedFreePractices = '[UnlockedFreePractices] Clear UnlockedFreePractices',
  StartAddManyUnlockedFreePractices = '[UnlockedFreePractices] Start Add many UnlockedFreePractices'
}

export class LoadUnlockedFreePractices implements Action {
  readonly type = UnlockedFreePracticesActionTypes.LoadUnlockedFreePractices;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class UnlockedFreePracticesLoaded implements Action {
  readonly type = UnlockedFreePracticesActionTypes.UnlockedFreePracticesLoaded;

  constructor(
    public payload: { unlockedFreePractices: UnlockedFreePracticeInterface[] }
  ) {}
}

export class UnlockedFreePracticesLoadError implements Action {
  readonly type =
    UnlockedFreePracticesActionTypes.UnlockedFreePracticesLoadError;
  constructor(public payload: any) {}
}

export class AddUnlockedFreePractice implements Action {
  readonly type = UnlockedFreePracticesActionTypes.AddUnlockedFreePractice;

  constructor(
    public payload: { unlockedFreePractice: UnlockedFreePracticeInterface }
  ) {}
}

export class UpsertUnlockedFreePractice implements Action {
  readonly type = UnlockedFreePracticesActionTypes.UpsertUnlockedFreePractice;

  constructor(
    public payload: { unlockedFreePractice: UnlockedFreePracticeInterface }
  ) {}
}

export class AddUnlockedFreePractices implements Action {
  readonly type = UnlockedFreePracticesActionTypes.AddUnlockedFreePractices;

  constructor(
    public payload: { unlockedFreePractices: UnlockedFreePracticeInterface[] }
  ) {}
}

export class UpsertUnlockedFreePractices implements Action {
  readonly type = UnlockedFreePracticesActionTypes.UpsertUnlockedFreePractices;

  constructor(
    public payload: { unlockedFreePractices: UnlockedFreePracticeInterface[] }
  ) {}
}

export class UpdateUnlockedFreePractice implements Action {
  readonly type = UnlockedFreePracticesActionTypes.UpdateUnlockedFreePractice;

  constructor(
    public payload: {
      unlockedFreePractice: Update<UnlockedFreePracticeInterface>;
    }
  ) {}
}

export class UpdateUnlockedFreePractices implements Action {
  readonly type = UnlockedFreePracticesActionTypes.UpdateUnlockedFreePractices;

  constructor(
    public payload: {
      unlockedFreePractices: Update<UnlockedFreePracticeInterface>[];
    }
  ) {}
}

export class DeleteUnlockedFreePractice implements Action {
  readonly type = UnlockedFreePracticesActionTypes.DeleteUnlockedFreePractice;

  constructor(public payload: { id: number }) {}
}

export class DeleteUnlockedFreePractices implements Action {
  readonly type = UnlockedFreePracticesActionTypes.DeleteUnlockedFreePractices;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearUnlockedFreePractices implements Action {
  readonly type = UnlockedFreePracticesActionTypes.ClearUnlockedFreePractices;
}

export class StartAddManyUnlockedFreePractices implements Action {
  readonly type =
    UnlockedFreePracticesActionTypes.StartAddManyUnlockedFreePractices;

  constructor(
    public payload: {
      userId: number;
      unlockedFreePractices: UnlockedFreePracticeInterface[];
    }
  ) {}
}

export type UnlockedFreePracticesActions =
  | LoadUnlockedFreePractices
  | UnlockedFreePracticesLoaded
  | UnlockedFreePracticesLoadError
  | AddUnlockedFreePractice
  | UpsertUnlockedFreePractice
  | AddUnlockedFreePractices
  | UpsertUnlockedFreePractices
  | UpdateUnlockedFreePractice
  | UpdateUnlockedFreePractices
  | DeleteUnlockedFreePractice
  | DeleteUnlockedFreePractices
  | ClearUnlockedFreePractices
  | StartAddManyUnlockedFreePractices;
