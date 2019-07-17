import { Action } from '@ngrx/store';
import { MethodInterface } from '../../+models';

export enum MethodsActionTypes {
  MethodsLoaded = '[Methods] Methods Loaded',
  MethodsLoadError = '[Methods] Load Error',
  LoadMethods = '[Methods] Load Methods',
  ClearMethods = '[Methods] Clear Methods'
}

export class LoadMethods implements Action {
  readonly type = MethodsActionTypes.LoadMethods;

  constructor(public payload: { force?: boolean; userId: number } = {}) {}
}

export class MethodsLoaded implements Action {
  readonly type = MethodsActionTypes.MethodsLoaded;

  constructor(public payload: { methods: MethodInterface[] }) {}
}

export class MethodsLoadError implements Action {
  readonly type = MethodsActionTypes.MethodsLoadError;
  constructor(public payload: any) {}
}

export class ClearMethods implements Action {
  readonly type = MethodsActionTypes.ClearMethods;
}

export type MethodsActions =
  | LoadMethods
  | MethodsLoaded
  | MethodsLoadError
  | ClearMethods;
