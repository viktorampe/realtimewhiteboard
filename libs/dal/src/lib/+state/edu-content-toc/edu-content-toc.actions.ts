import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EduContentTOCInterface } from '../../+models';

export enum EduContentTocsActionTypes {
  EduContentTocsLoaded = '[EduContentTocs] EduContentTocs Loaded',
  EduContentTocsLoadError = '[EduContentTocs] Load Error',
  LoadEduContentTocs = '[EduContentTocs] Load EduContentTocs',
  AddEduContentToc = '[EduContentTocs] Add EduContentToc',
  UpsertEduContentToc = '[EduContentTocs] Upsert EduContentToc',
  AddEduContentTocs = '[EduContentTocs] Add EduContentTocs',
  UpsertEduContentTocs = '[EduContentTocs] Upsert EduContentTocs',
  UpdateEduContentToc = '[EduContentTocs] Update EduContentToc',
  UpdateEduContentTocs = '[EduContentTocs] Update EduContentTocs',
  DeleteEduContentToc = '[EduContentTocs] Delete EduContentToc',
  DeleteEduContentTocs = '[EduContentTocs] Delete EduContentTocs',
  ClearEduContentTocs = '[EduContentTocs] Clear EduContentTocs'
}

export class LoadEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.LoadEduContentTocs;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class EduContentTocsLoaded implements Action {
  readonly type = EduContentTocsActionTypes.EduContentTocsLoaded;

  constructor(public payload: { eduContentTocs: EduContentTOCInterface[] }) {}
}

export class EduContentTocsLoadError implements Action {
  readonly type = EduContentTocsActionTypes.EduContentTocsLoadError;
  constructor(public payload: any) {}
}

export class AddEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.AddEduContentToc;

  constructor(public payload: { eduContentToc: EduContentTOCInterface }) {}
}

export class UpsertEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.UpsertEduContentToc;

  constructor(public payload: { eduContentToc: EduContentTOCInterface }) {}
}

export class AddEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.AddEduContentTocs;

  constructor(public payload: { eduContentTocs: EduContentTOCInterface[] }) {}
}

export class UpsertEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.UpsertEduContentTocs;

  constructor(public payload: { eduContentTocs: EduContentTOCInterface[] }) {}
}

export class UpdateEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.UpdateEduContentToc;

  constructor(
    public payload: { eduContentToc: Update<EduContentTOCInterface> }
  ) {}
}

export class UpdateEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.UpdateEduContentTocs;

  constructor(
    public payload: { eduContentTocs: Update<EduContentTOCInterface>[] }
  ) {}
}

export class DeleteEduContentToc implements Action {
  readonly type = EduContentTocsActionTypes.DeleteEduContentToc;

  constructor(public payload: { id: number }) {}
}

export class DeleteEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.DeleteEduContentTocs;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearEduContentTocs implements Action {
  readonly type = EduContentTocsActionTypes.ClearEduContentTocs;
}

export type EduContentTocsActions =
  | LoadEduContentTocs
  | EduContentTocsLoaded
  | EduContentTocsLoadError
  | AddEduContentToc
  | UpsertEduContentToc
  | AddEduContentTocs
  | UpsertEduContentTocs
  | UpdateEduContentToc
  | UpdateEduContentTocs
  | DeleteEduContentToc
  | DeleteEduContentTocs
  | ClearEduContentTocs;
