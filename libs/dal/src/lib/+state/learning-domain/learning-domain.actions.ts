import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { LearningDomainInterface } from '../../+models';

export enum LearningDomainsActionTypes {
  LearningDomainsLoaded = '[LearningDomains] LearningDomains Loaded',
  LearningDomainsLoadError = '[LearningDomains] Load Error',
  LoadLearningDomains = '[LearningDomains] Load LearningDomains',
  AddLearningDomain = '[LearningDomains] Add LearningDomain',
  UpsertLearningDomain = '[LearningDomains] Upsert LearningDomain',
  AddLearningDomains = '[LearningDomains] Add LearningDomains',
  UpsertLearningDomains = '[LearningDomains] Upsert LearningDomains',
  UpdateLearningDomain = '[LearningDomains] Update LearningDomain',
  UpdateLearningDomains = '[LearningDomains] Update LearningDomains',
  DeleteLearningDomain = '[LearningDomains] Delete LearningDomain',
  DeleteLearningDomains = '[LearningDomains] Delete LearningDomains',
  ClearLearningDomains = '[LearningDomains] Clear LearningDomains'
}

export class LoadLearningDomains implements Action {
  readonly type = LearningDomainsActionTypes.LoadLearningDomains;

  constructor(public payload: { force?: boolean } = {}) {}
}

export class LearningDomainsLoaded implements Action {
  readonly type = LearningDomainsActionTypes.LearningDomainsLoaded;

  constructor(public payload: { learningDomains: LearningDomainInterface[] }) {}
}

export class LearningDomainsLoadError implements Action {
  readonly type = LearningDomainsActionTypes.LearningDomainsLoadError;
  constructor(public payload: any) {}
}

export class AddLearningDomain implements Action {
  readonly type = LearningDomainsActionTypes.AddLearningDomain;

  constructor(public payload: { learningDomain: LearningDomainInterface }) {}
}

export class UpsertLearningDomain implements Action {
  readonly type = LearningDomainsActionTypes.UpsertLearningDomain;

  constructor(public payload: { learningDomain: LearningDomainInterface }) {}
}

export class AddLearningDomains implements Action {
  readonly type = LearningDomainsActionTypes.AddLearningDomains;

  constructor(public payload: { learningDomains: LearningDomainInterface[] }) {}
}

export class UpsertLearningDomains implements Action {
  readonly type = LearningDomainsActionTypes.UpsertLearningDomains;

  constructor(public payload: { learningDomains: LearningDomainInterface[] }) {}
}

export class UpdateLearningDomain implements Action {
  readonly type = LearningDomainsActionTypes.UpdateLearningDomain;

  constructor(
    public payload: { learningDomain: Update<LearningDomainInterface> }
  ) {}
}

export class UpdateLearningDomains implements Action {
  readonly type = LearningDomainsActionTypes.UpdateLearningDomains;

  constructor(
    public payload: { learningDomains: Update<LearningDomainInterface>[] }
  ) {}
}

export class DeleteLearningDomain implements Action {
  readonly type = LearningDomainsActionTypes.DeleteLearningDomain;

  constructor(public payload: { id: number }) {}
}

export class DeleteLearningDomains implements Action {
  readonly type = LearningDomainsActionTypes.DeleteLearningDomains;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearLearningDomains implements Action {
  readonly type = LearningDomainsActionTypes.ClearLearningDomains;
}

export type LearningDomainsActions =
  | LoadLearningDomains
  | LearningDomainsLoaded
  | LearningDomainsLoadError
  | AddLearningDomain
  | UpsertLearningDomain
  | AddLearningDomains
  | UpsertLearningDomains
  | UpdateLearningDomain
  | UpdateLearningDomains
  | DeleteLearningDomain
  | DeleteLearningDomains
  | ClearLearningDomains;
