import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { BundleInterface } from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum BundlesActionTypes {
  BundlesLoaded = '[Bundles] Bundles Loaded',
  BundlesLoadError = '[Bundles] Load Error',
  LoadBundles = '[Bundles] Load Bundles',
  AddBundle = '[Bundles] Add Bundle',
  UpsertBundle = '[Bundles] Upsert Bundle',
  AddBundles = '[Bundles] Add Bundles',
  UpsertBundles = '[Bundles] Upsert Bundles',
  UpdateBundle = '[Bundles] Update Bundle',
  UpdateBundles = '[Bundles] Update Bundles',
  DeleteBundle = '[Bundles] Delete Bundle',
  DeleteBundles = '[Bundles] Delete Bundles',
  ClearBundles = '[Bundles] Clear Bundles',
  LinkEduContent = '[Bundles] Link EduContent',
  LinkUserContent = '[Bundles] Link UserContent'
}

export class LoadBundles implements Action {
  readonly type = BundlesActionTypes.LoadBundles;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class BundlesLoaded implements Action {
  readonly type = BundlesActionTypes.BundlesLoaded;

  constructor(public payload: { bundles: BundleInterface[] }) {}
}

export class BundlesLoadError implements Action {
  readonly type = BundlesActionTypes.BundlesLoadError;
  constructor(public payload: any) {}
}

export class AddBundle implements Action {
  readonly type = BundlesActionTypes.AddBundle;

  constructor(public payload: { bundle: BundleInterface }) {}
}

export class UpsertBundle implements Action {
  readonly type = BundlesActionTypes.UpsertBundle;

  constructor(public payload: { bundle: BundleInterface }) {}
}

export class AddBundles implements Action {
  readonly type = BundlesActionTypes.AddBundles;

  constructor(public payload: { bundles: BundleInterface[] }) {}
}

export class UpsertBundles implements Action {
  readonly type = BundlesActionTypes.UpsertBundles;

  constructor(public payload: { bundles: BundleInterface[] }) {}
}

export class UpdateBundle implements Action {
  readonly type = BundlesActionTypes.UpdateBundle;

  constructor(public payload: { bundle: Update<BundleInterface> }) {}
}

export class UpdateBundles implements Action {
  readonly type = BundlesActionTypes.UpdateBundles;

  constructor(public payload: { bundles: Update<BundleInterface>[] }) {}
}

export class DeleteBundle implements Action {
  readonly type = BundlesActionTypes.DeleteBundle;

  constructor(public payload: { id: number }) {}
}

export class DeleteBundles implements Action {
  readonly type = BundlesActionTypes.DeleteBundles;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearBundles implements Action {
  readonly type = BundlesActionTypes.ClearBundles;
}

export class LinkEduContent implements FeedbackTriggeringAction {
  readonly type = BundlesActionTypes.LinkEduContent;

  constructor(
    public payload: {
      bundleId: number;
      eduContentId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class LinkUserContent implements FeedbackTriggeringAction {
  readonly type = BundlesActionTypes.LinkUserContent;

  constructor(
    public payload: {
      bundleId: number;
      userContentId: number;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export type BundlesActions =
  | LoadBundles
  | BundlesLoaded
  | BundlesLoadError
  | AddBundle
  | UpsertBundle
  | AddBundles
  | UpsertBundles
  | UpdateBundle
  | UpdateBundles
  | DeleteBundle
  | DeleteBundles
  | ClearBundles
  | LinkEduContent
  | LinkUserContent;
