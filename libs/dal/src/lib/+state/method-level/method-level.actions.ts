import { Action } from '@ngrx/store';
import { MethodLevelInterface } from '../../+models';

export enum MethodLevelsActionTypes {
  MethodLevelsLoaded = '[MethodLevels] MethodLevels Loaded',
  MethodLevelsLoadError = '[MethodLevels] Load Error',
  LoadMethodLevels = '[MethodLevels] Load MethodLevels'
}

export class LoadMethodLevels implements Action {
  readonly type = MethodLevelsActionTypes.LoadMethodLevels;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class MethodLevelsLoaded implements Action {
  readonly type = MethodLevelsActionTypes.MethodLevelsLoaded;

  constructor(public payload: { methodLevels: MethodLevelInterface[] }) {}
}

export class MethodLevelsLoadError implements Action {
  readonly type = MethodLevelsActionTypes.MethodLevelsLoadError;
  constructor(public payload: any) {}
}

export type MethodLevelsActions =
  | LoadMethodLevels
  | MethodLevelsLoaded
  | MethodLevelsLoadError;
