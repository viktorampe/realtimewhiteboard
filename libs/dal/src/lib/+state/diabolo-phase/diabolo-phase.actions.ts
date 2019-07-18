import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { DiaboloPhaseInterface } from '../../+models';

export enum DiaboloPhasesActionTypes {
  DiaboloPhasesLoaded = '[DiaboloPhases] DiaboloPhases Loaded',
  DiaboloPhasesLoadError = '[DiaboloPhases] Load Error',
  LoadDiaboloPhases = '[DiaboloPhases] Load DiaboloPhases',
  AddDiaboloPhase = '[DiaboloPhases] Add DiaboloPhase',
  UpsertDiaboloPhase = '[DiaboloPhases] Upsert DiaboloPhase',
  AddDiaboloPhases = '[DiaboloPhases] Add DiaboloPhases',
  UpsertDiaboloPhases = '[DiaboloPhases] Upsert DiaboloPhases',
  UpdateDiaboloPhase = '[DiaboloPhases] Update DiaboloPhase',
  UpdateDiaboloPhases = '[DiaboloPhases] Update DiaboloPhases',
  DeleteDiaboloPhase = '[DiaboloPhases] Delete DiaboloPhase',
  DeleteDiaboloPhases = '[DiaboloPhases] Delete DiaboloPhases',
  ClearDiaboloPhases = '[DiaboloPhases] Clear DiaboloPhases'
}

export class LoadDiaboloPhases implements Action {
  readonly type = DiaboloPhasesActionTypes.LoadDiaboloPhases;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class DiaboloPhasesLoaded implements Action {
  readonly type = DiaboloPhasesActionTypes.DiaboloPhasesLoaded;

  constructor(public payload: { diaboloPhases: DiaboloPhaseInterface[] }) {}
}

export class DiaboloPhasesLoadError implements Action {
  readonly type = DiaboloPhasesActionTypes.DiaboloPhasesLoadError;
  constructor(public payload: any) {}
}

export class AddDiaboloPhase implements Action {
  readonly type = DiaboloPhasesActionTypes.AddDiaboloPhase;

  constructor(public payload: { diaboloPhase: DiaboloPhaseInterface }) {}
}

export class UpsertDiaboloPhase implements Action {
  readonly type = DiaboloPhasesActionTypes.UpsertDiaboloPhase;

  constructor(public payload: { diaboloPhase: DiaboloPhaseInterface }) {}
}

export class AddDiaboloPhases implements Action {
  readonly type = DiaboloPhasesActionTypes.AddDiaboloPhases;

  constructor(public payload: { diaboloPhases: DiaboloPhaseInterface[] }) {}
}

export class UpsertDiaboloPhases implements Action {
  readonly type = DiaboloPhasesActionTypes.UpsertDiaboloPhases;

  constructor(public payload: { diaboloPhases: DiaboloPhaseInterface[] }) {}
}

export class UpdateDiaboloPhase implements Action {
  readonly type = DiaboloPhasesActionTypes.UpdateDiaboloPhase;

  constructor(
    public payload: { diaboloPhase: Update<DiaboloPhaseInterface> }
  ) {}
}

export class UpdateDiaboloPhases implements Action {
  readonly type = DiaboloPhasesActionTypes.UpdateDiaboloPhases;

  constructor(
    public payload: { diaboloPhases: Update<DiaboloPhaseInterface>[] }
  ) {}
}

export class DeleteDiaboloPhase implements Action {
  readonly type = DiaboloPhasesActionTypes.DeleteDiaboloPhase;

  constructor(public payload: { id: number }) {}
}

export class DeleteDiaboloPhases implements Action {
  readonly type = DiaboloPhasesActionTypes.DeleteDiaboloPhases;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearDiaboloPhases implements Action {
  readonly type = DiaboloPhasesActionTypes.ClearDiaboloPhases;
}

export type DiaboloPhasesActions =
  | LoadDiaboloPhases
  | DiaboloPhasesLoaded
  | DiaboloPhasesLoadError
  | AddDiaboloPhase
  | UpsertDiaboloPhase
  | AddDiaboloPhases
  | UpsertDiaboloPhases
  | UpdateDiaboloPhase
  | UpdateDiaboloPhases
  | DeleteDiaboloPhase
  | DeleteDiaboloPhases
  | ClearDiaboloPhases;
