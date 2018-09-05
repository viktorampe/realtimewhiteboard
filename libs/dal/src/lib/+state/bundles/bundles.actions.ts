import { Action } from '@ngrx/store';
import { Entity } from './bundles.reducer';

export enum BundlesActionTypes {
  LoadBundles = '[Bundles] Load Bundles',
  BundlesLoaded = '[Bundles] Bundles Loaded',
  BundlesLoadError = '[Bundles] Bundles Load Error'
}

export class LoadBundles implements Action {
  readonly type = BundlesActionTypes.LoadBundles;
}

export class BundlesLoadError implements Action {
  readonly type = BundlesActionTypes.BundlesLoadError;
  constructor(public payload: any) {}
}

export class BundlesLoaded implements Action {
  readonly type = BundlesActionTypes.BundlesLoaded;
  constructor(public payload: Entity[]) {}
}

export type BundlesAction = LoadBundles | BundlesLoaded | BundlesLoadError;

export const fromBundlesActions = {
  LoadBundles,
  BundlesLoaded,
  BundlesLoadError
};
