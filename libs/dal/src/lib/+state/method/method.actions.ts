import { Action } from '@ngrx/store';
import { MethodInterface } from '../../+models';

export enum MethodsActionTypes {
  MethodsLoaded = '[Methods] Methods Loaded',
  MethodsLoadError = '[Methods] Load Error',
  LoadMethods = '[Methods] Load Methods',
  ClearMethods = '[Methods] Clear Methods',
  LoadAllowedMethods = '[Methods] Load Allowed Methods',
  AllowedMethodsLoaded = '[Methods] Allowed Methods Loaded',
  AllowedMethodsLoadError = '[Methods] Allowed Methods Load Error'
}

export class LoadMethods implements Action {
  readonly type = MethodsActionTypes.LoadMethods;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class MethodsLoaded implements Action {
  readonly type = MethodsActionTypes.MethodsLoaded;

  constructor(public payload: { methods: MethodInterface[] }) {}
}

export class LoadAllowedMethods implements Action {
  readonly type = MethodsActionTypes.LoadAllowedMethods;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class AllowedMethodsLoaded implements Action {
  readonly type = MethodsActionTypes.AllowedMethodsLoaded;

  constructor(public payload: { methodIds: number[] }) {}
}

export class AllowedMethodsLoadError implements Action {
  readonly type = MethodsActionTypes.AllowedMethodsLoadError;
  constructor(public payload: any) {}
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
  | LoadAllowedMethods
  | AllowedMethodsLoaded
  | AllowedMethodsLoadError
  | MethodsLoadError
  | ClearMethods;
