import { Action } from '@ngrx/store';
import { DiaboloPhaseInterface } from '../../+models';

export enum DiaboloPhasesActionTypes {
  DiaboloPhasesLoaded = '[DiaboloPhases] DiaboloPhases Loaded',
  DiaboloPhasesLoadError = '[DiaboloPhases] Load Error',
  LoadDiaboloPhases = '[DiaboloPhases] Load DiaboloPhases'
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

export type DiaboloPhasesActions =
  | LoadDiaboloPhases
  | DiaboloPhasesLoaded
  | DiaboloPhasesLoadError;
