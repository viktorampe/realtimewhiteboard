import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EduContentInterface } from '../../+models';

export enum EduContentsActionTypes {
  EduContentsLoaded = '[EduContents] EduContents Loaded',
  EduContentsLoadError = '[EduContents] Load Error',
  LoadEduContents = '[EduContents] Load EduContents',
  AddEduContent = '[EduContents] Add EduContent',
  UpsertEduContent = '[EduContents] Upsert EduContent',
  AddEduContents = '[EduContents] Add EduContents',
  UpsertEduContents = '[EduContents] Upsert EduContents',
  UpdateEduContent = '[EduContents] Update EduContent',
  UpdateEduContents = '[EduContents] Update EduContents',
  DeleteEduContent = '[EduContents] Delete EduContent',
  DeleteEduContents = '[EduContents] Delete EduContents',
  ClearEduContents = '[EduContents] Clear EduContents'
}

export class LoadEduContents implements Action {
  readonly type = EduContentsActionTypes.LoadEduContents;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class EduContentsLoaded implements Action {
  readonly type = EduContentsActionTypes.EduContentsLoaded;

  constructor(public payload: { eduContents: EduContentInterface[] }) {}
}

export class EduContentsLoadError implements Action {
  readonly type = EduContentsActionTypes.EduContentsLoadError;
  constructor(public payload: any) {}
}

export class AddEduContent implements Action {
  readonly type = EduContentsActionTypes.AddEduContent;

  constructor(public payload: { eduContent: EduContentInterface }) {}
}

export class UpsertEduContent implements Action {
  readonly type = EduContentsActionTypes.UpsertEduContent;

  constructor(public payload: { eduContent: EduContentInterface }) {}
}

export class AddEduContents implements Action {
  readonly type = EduContentsActionTypes.AddEduContents;

  constructor(public payload: { eduContents: EduContentInterface[] }) {}
}

export class UpsertEduContents implements Action {
  readonly type = EduContentsActionTypes.UpsertEduContents;

  constructor(public payload: { eduContents: EduContentInterface[] }) {}
}

export class UpdateEduContent implements Action {
  readonly type = EduContentsActionTypes.UpdateEduContent;

  constructor(public payload: { eduContent: Update<EduContentInterface> }) {}
}

export class UpdateEduContents implements Action {
  readonly type = EduContentsActionTypes.UpdateEduContents;

  constructor(public payload: { eduContents: Update<EduContentInterface>[] }) {}
}

export class DeleteEduContent implements Action {
  readonly type = EduContentsActionTypes.DeleteEduContent;

  constructor(public payload: { id: number }) {}
}

export class DeleteEduContents implements Action {
  readonly type = EduContentsActionTypes.DeleteEduContents;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearEduContents implements Action {
  readonly type = EduContentsActionTypes.ClearEduContents;
}

export type EduContentsActions =
  | LoadEduContents
  | EduContentsLoaded
  | EduContentsLoadError
  | AddEduContent
  | UpsertEduContent
  | AddEduContents
  | UpsertEduContents
  | UpdateEduContent
  | UpdateEduContents
  | DeleteEduContent
  | DeleteEduContents
  | ClearEduContents;
