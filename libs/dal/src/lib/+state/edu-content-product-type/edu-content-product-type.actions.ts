import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EduContentProductTypeInterface } from '../../+models';

export enum EduContentProductTypesActionTypes {
  EduContentProductTypesLoaded = '[EduContentProductTypes] EduContentProductTypes Loaded',
  EduContentProductTypesLoadError = '[EduContentProductTypes] Load Error',
  LoadEduContentProductTypes = '[EduContentProductTypes] Load EduContentProductTypes',
  AddEduContentProductType = '[EduContentProductTypes] Add EduContentProductType',
  UpsertEduContentProductType = '[EduContentProductTypes] Upsert EduContentProductType',
  AddEduContentProductTypes = '[EduContentProductTypes] Add EduContentProductTypes',
  UpsertEduContentProductTypes = '[EduContentProductTypes] Upsert EduContentProductTypes',
  UpdateEduContentProductType = '[EduContentProductTypes] Update EduContentProductType',
  UpdateEduContentProductTypes = '[EduContentProductTypes] Update EduContentProductTypes',
  DeleteEduContentProductType = '[EduContentProductTypes] Delete EduContentProductType',
  DeleteEduContentProductTypes = '[EduContentProductTypes] Delete EduContentProductTypes',
  ClearEduContentProductTypes = '[EduContentProductTypes] Clear EduContentProductTypes'
}

export class LoadEduContentProductTypes implements Action {
  readonly type = EduContentProductTypesActionTypes.LoadEduContentProductTypes;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class EduContentProductTypesLoaded implements Action {
  readonly type = EduContentProductTypesActionTypes.EduContentProductTypesLoaded;

  constructor(public payload: { eduContentProductTypes: EduContentProductTypeInterface[] }) {}
}

export class EduContentProductTypesLoadError implements Action {
  readonly type = EduContentProductTypesActionTypes.EduContentProductTypesLoadError;
  constructor(public payload: any) {}
}

export class AddEduContentProductType implements Action {
  readonly type = EduContentProductTypesActionTypes.AddEduContentProductType;

  constructor(public payload: { eduContentProductType: EduContentProductTypeInterface }) {}
}

export class UpsertEduContentProductType implements Action {
  readonly type = EduContentProductTypesActionTypes.UpsertEduContentProductType;

  constructor(public payload: { eduContentProductType: EduContentProductTypeInterface }) {}
}

export class AddEduContentProductTypes implements Action {
  readonly type = EduContentProductTypesActionTypes.AddEduContentProductTypes;

  constructor(public payload: { eduContentProductTypes: EduContentProductTypeInterface[] }) {}
}

export class UpsertEduContentProductTypes implements Action {
  readonly type = EduContentProductTypesActionTypes.UpsertEduContentProductTypes;

  constructor(public payload: { eduContentProductTypes: EduContentProductTypeInterface[] }) {}
}

export class UpdateEduContentProductType implements Action {
  readonly type = EduContentProductTypesActionTypes.UpdateEduContentProductType;

  constructor(public payload: { eduContentProductType: Update<EduContentProductTypeInterface> }) {}
}

export class UpdateEduContentProductTypes implements Action {
  readonly type = EduContentProductTypesActionTypes.UpdateEduContentProductTypes;

  constructor(public payload: { eduContentProductTypes: Update<EduContentProductTypeInterface>[] }) {}
}

export class DeleteEduContentProductType implements Action {
  readonly type = EduContentProductTypesActionTypes.DeleteEduContentProductType;

  constructor(public payload: { id: number }) {}
}

export class DeleteEduContentProductTypes implements Action {
  readonly type = EduContentProductTypesActionTypes.DeleteEduContentProductTypes;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearEduContentProductTypes implements Action {
  readonly type = EduContentProductTypesActionTypes.ClearEduContentProductTypes;
}

export type EduContentProductTypesActions =
  | LoadEduContentProductTypes
  | EduContentProductTypesLoaded
  | EduContentProductTypesLoadError
  | AddEduContentProductType
  | UpsertEduContentProductType
  | AddEduContentProductTypes
  | UpsertEduContentProductTypes
  | UpdateEduContentProductType
  | UpdateEduContentProductTypes
  | DeleteEduContentProductType
  | DeleteEduContentProductTypes
  | ClearEduContentProductTypes;
