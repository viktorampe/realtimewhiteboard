import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { ClassGroupInterface } from '../../+models';

export enum ClassGroupsActionTypes {
  ClassGroupsLoaded = '[ClassGroups] ClassGroups Loaded',
  ClassGroupsLoadError = '[ClassGroups] Load Error',
  LoadClassGroups = '[ClassGroups] Load ClassGroups',
  AddClassGroup = '[ClassGroups] Add ClassGroup',
  UpsertClassGroup = '[ClassGroups] Upsert ClassGroup',
  AddClassGroups = '[ClassGroups] Add ClassGroups',
  UpsertClassGroups = '[ClassGroups] Upsert ClassGroups',
  UpdateClassGroup = '[ClassGroups] Update ClassGroup',
  UpdateClassGroups = '[ClassGroups] Update ClassGroups',
  DeleteClassGroup = '[ClassGroups] Delete ClassGroup',
  DeleteClassGroups = '[ClassGroups] Delete ClassGroups',
  ClearClassGroups = '[ClassGroups] Clear ClassGroups'
}

export class LoadClassGroups implements Action {
  readonly type = ClassGroupsActionTypes.LoadClassGroups;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class ClassGroupsLoaded implements Action {
  readonly type = ClassGroupsActionTypes.ClassGroupsLoaded;

  constructor(public payload: { classGroups: ClassGroupInterface[] }) {}
}

export class ClassGroupsLoadError implements Action {
  readonly type = ClassGroupsActionTypes.ClassGroupsLoadError;
  constructor(public payload: any) {}
}

export class AddClassGroup implements Action {
  readonly type = ClassGroupsActionTypes.AddClassGroup;

  constructor(public payload: { classGroup: ClassGroupInterface }) {}
}

export class UpsertClassGroup implements Action {
  readonly type = ClassGroupsActionTypes.UpsertClassGroup;

  constructor(public payload: { classGroup: ClassGroupInterface }) {}
}

export class AddClassGroups implements Action {
  readonly type = ClassGroupsActionTypes.AddClassGroups;

  constructor(public payload: { classGroups: ClassGroupInterface[] }) {}
}

export class UpsertClassGroups implements Action {
  readonly type = ClassGroupsActionTypes.UpsertClassGroups;

  constructor(public payload: { classGroups: ClassGroupInterface[] }) {}
}

export class UpdateClassGroup implements Action {
  readonly type = ClassGroupsActionTypes.UpdateClassGroup;

  constructor(public payload: { classGroup: Update<ClassGroupInterface> }) {}
}

export class UpdateClassGroups implements Action {
  readonly type = ClassGroupsActionTypes.UpdateClassGroups;

  constructor(public payload: { classGroups: Update<ClassGroupInterface>[] }) {}
}

export class DeleteClassGroup implements Action {
  readonly type = ClassGroupsActionTypes.DeleteClassGroup;

  constructor(public payload: { id: number }) {}
}

export class DeleteClassGroups implements Action {
  readonly type = ClassGroupsActionTypes.DeleteClassGroups;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearClassGroups implements Action {
  readonly type = ClassGroupsActionTypes.ClearClassGroups;
}

export type ClassGroupsActions =
  | LoadClassGroups
  | ClassGroupsLoaded
  | ClassGroupsLoadError
  | AddClassGroup
  | UpsertClassGroup
  | AddClassGroups
  | UpsertClassGroups
  | UpdateClassGroup
  | UpdateClassGroups
  | DeleteClassGroup
  | DeleteClassGroups
  | ClearClassGroups;
