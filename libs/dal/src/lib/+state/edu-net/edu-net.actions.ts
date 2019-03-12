import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EduNetInterface } from '../../+models';

export enum EduNetsActionTypes {
  EduNetsLoaded = '[EduNets] EduNets Loaded',
  EduNetsLoadError = '[EduNets] Load Error',
  LoadEduNets = '[EduNets] Load EduNets',
  AddEduNet = '[EduNets] Add EduNet',
  UpsertEduNet = '[EduNets] Upsert EduNet',
  AddEduNets = '[EduNets] Add EduNets',
  UpsertEduNets = '[EduNets] Upsert EduNets',
  UpdateEduNet = '[EduNets] Update EduNet',
  UpdateEduNets = '[EduNets] Update EduNets',
  DeleteEduNet = '[EduNets] Delete EduNet',
  DeleteEduNets = '[EduNets] Delete EduNets',
  ClearEduNets = '[EduNets] Clear EduNets'
}

export class LoadEduNets implements Action {
  readonly type = EduNetsActionTypes.LoadEduNets;

  constructor(
    public payload: { force?: boolean, userId: number } = { userId: null }
  ) {}
}

export class EduNetsLoaded implements Action {
  readonly type = EduNetsActionTypes.EduNetsLoaded;

  constructor(public payload: { eduNets: EduNetInterface[] }) {}
}

export class EduNetsLoadError implements Action {
  readonly type = EduNetsActionTypes.EduNetsLoadError;
  constructor(public payload: any) {}
}

export class AddEduNet implements Action {
  readonly type = EduNetsActionTypes.AddEduNet;

  constructor(public payload: { eduNet: EduNetInterface }) {}
}

export class UpsertEduNet implements Action {
  readonly type = EduNetsActionTypes.UpsertEduNet;

  constructor(public payload: { eduNet: EduNetInterface }) {}
}

export class AddEduNets implements Action {
  readonly type = EduNetsActionTypes.AddEduNets;

  constructor(public payload: { eduNets: EduNetInterface[] }) {}
}

export class UpsertEduNets implements Action {
  readonly type = EduNetsActionTypes.UpsertEduNets;

  constructor(public payload: { eduNets: EduNetInterface[] }) {}
}

export class UpdateEduNet implements Action {
  readonly type = EduNetsActionTypes.UpdateEduNet;

  constructor(public payload: { eduNet: Update<EduNetInterface> }) {}
}

export class UpdateEduNets implements Action {
  readonly type = EduNetsActionTypes.UpdateEduNets;

  constructor(public payload: { eduNets: Update<EduNetInterface>[] }) {}
}

export class DeleteEduNet implements Action {
  readonly type = EduNetsActionTypes.DeleteEduNet;

  constructor(public payload: { id: number }) {}
}

export class DeleteEduNets implements Action {
  readonly type = EduNetsActionTypes.DeleteEduNets;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearEduNets implements Action {
  readonly type = EduNetsActionTypes.ClearEduNets;
}

export type EduNetsActions =
  | LoadEduNets
  | EduNetsLoaded
  | EduNetsLoadError
  | AddEduNet
  | UpsertEduNet
  | AddEduNets
  | UpsertEduNets
  | UpdateEduNet
  | UpdateEduNets
  | DeleteEduNet
  | DeleteEduNets
  | ClearEduNets;
