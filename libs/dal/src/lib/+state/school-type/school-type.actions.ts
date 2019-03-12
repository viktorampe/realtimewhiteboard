import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { SchoolTypeInterface } from '../../+models';

export enum SchoolTypesActionTypes {
  SchoolTypesLoaded = '[SchoolTypes] SchoolTypes Loaded',
  SchoolTypesLoadError = '[SchoolTypes] Load Error',
  LoadSchoolTypes = '[SchoolTypes] Load SchoolTypes',
  AddSchoolType = '[SchoolTypes] Add SchoolType',
  UpsertSchoolType = '[SchoolTypes] Upsert SchoolType',
  AddSchoolTypes = '[SchoolTypes] Add SchoolTypes',
  UpsertSchoolTypes = '[SchoolTypes] Upsert SchoolTypes',
  UpdateSchoolType = '[SchoolTypes] Update SchoolType',
  UpdateSchoolTypes = '[SchoolTypes] Update SchoolTypes',
  DeleteSchoolType = '[SchoolTypes] Delete SchoolType',
  DeleteSchoolTypes = '[SchoolTypes] Delete SchoolTypes',
  ClearSchoolTypes = '[SchoolTypes] Clear SchoolTypes'
}

export class LoadSchoolTypes implements Action {
  readonly type = SchoolTypesActionTypes.LoadSchoolTypes;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class SchoolTypesLoaded implements Action {
  readonly type = SchoolTypesActionTypes.SchoolTypesLoaded;

  constructor(public payload: { schoolTypes: SchoolTypeInterface[] }) {}
}

export class SchoolTypesLoadError implements Action {
  readonly type = SchoolTypesActionTypes.SchoolTypesLoadError;
  constructor(public payload: any) {}
}

export class AddSchoolType implements Action {
  readonly type = SchoolTypesActionTypes.AddSchoolType;

  constructor(public payload: { schoolType: SchoolTypeInterface }) {}
}

export class UpsertSchoolType implements Action {
  readonly type = SchoolTypesActionTypes.UpsertSchoolType;

  constructor(public payload: { schoolType: SchoolTypeInterface }) {}
}

export class AddSchoolTypes implements Action {
  readonly type = SchoolTypesActionTypes.AddSchoolTypes;

  constructor(public payload: { schoolTypes: SchoolTypeInterface[] }) {}
}

export class UpsertSchoolTypes implements Action {
  readonly type = SchoolTypesActionTypes.UpsertSchoolTypes;

  constructor(public payload: { schoolTypes: SchoolTypeInterface[] }) {}
}

export class UpdateSchoolType implements Action {
  readonly type = SchoolTypesActionTypes.UpdateSchoolType;

  constructor(public payload: { schoolType: Update<SchoolTypeInterface> }) {}
}

export class UpdateSchoolTypes implements Action {
  readonly type = SchoolTypesActionTypes.UpdateSchoolTypes;

  constructor(public payload: { schoolTypes: Update<SchoolTypeInterface>[] }) {}
}

export class DeleteSchoolType implements Action {
  readonly type = SchoolTypesActionTypes.DeleteSchoolType;

  constructor(public payload: { id: number }) {}
}

export class DeleteSchoolTypes implements Action {
  readonly type = SchoolTypesActionTypes.DeleteSchoolTypes;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearSchoolTypes implements Action {
  readonly type = SchoolTypesActionTypes.ClearSchoolTypes;
}

export type SchoolTypesActions =
  | LoadSchoolTypes
  | SchoolTypesLoaded
  | SchoolTypesLoadError
  | AddSchoolType
  | UpsertSchoolType
  | AddSchoolTypes
  | UpsertSchoolTypes
  | UpdateSchoolType
  | UpdateSchoolTypes
  | DeleteSchoolType
  | DeleteSchoolTypes
  | ClearSchoolTypes;
