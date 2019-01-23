import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { EffectFeedbackInterface } from './effect-feedback.model';

export enum EffectFeedbackActionTypes {
  LoadEffectFeedbacks = '[EffectFeedback] Load EffectFeedbacks',
  AddEffectFeedback = '[EffectFeedback] Add EffectFeedback',
  UpsertEffectFeedback = '[EffectFeedback] Upsert EffectFeedback',
  AddEffectFeedbacks = '[EffectFeedback] Add EffectFeedbacks',
  UpsertEffectFeedbacks = '[EffectFeedback] Upsert EffectFeedbacks',
  UpdateEffectFeedback = '[EffectFeedback] Update EffectFeedback',
  UpdateEffectFeedbacks = '[EffectFeedback] Update EffectFeedbacks',
  DeleteEffectFeedback = '[EffectFeedback] Delete EffectFeedback',
  DeleteEffectFeedbacks = '[EffectFeedback] Delete EffectFeedbacks',
  ClearEffectFeedbacks = '[EffectFeedback] Clear EffectFeedbacks'
}

export class LoadEffectFeedbacks implements Action {
  readonly type = EffectFeedbackActionTypes.LoadEffectFeedbacks;

  constructor(public payload: { effectFeedbacks: EffectFeedbackInterface[] }) {}
}

export class AddEffectFeedback implements Action {
  readonly type = EffectFeedbackActionTypes.AddEffectFeedback;

  constructor(public payload: { effectFeedback: EffectFeedbackInterface }) {}
}

export class UpsertEffectFeedback implements Action {
  readonly type = EffectFeedbackActionTypes.UpsertEffectFeedback;

  constructor(public payload: { effectFeedback: EffectFeedbackInterface }) {}
}

export class AddEffectFeedbacks implements Action {
  readonly type = EffectFeedbackActionTypes.AddEffectFeedbacks;

  constructor(public payload: { effectFeedbacks: EffectFeedbackInterface[] }) {}
}

export class UpsertEffectFeedbacks implements Action {
  readonly type = EffectFeedbackActionTypes.UpsertEffectFeedbacks;

  constructor(public payload: { effectFeedbacks: EffectFeedbackInterface[] }) {}
}

export class UpdateEffectFeedback implements Action {
  readonly type = EffectFeedbackActionTypes.UpdateEffectFeedback;

  constructor(
    public payload: { effectFeedback: Update<EffectFeedbackInterface> }
  ) {}
}

export class UpdateEffectFeedbacks implements Action {
  readonly type = EffectFeedbackActionTypes.UpdateEffectFeedbacks;

  constructor(
    public payload: { effectFeedbacks: Update<EffectFeedbackInterface>[] }
  ) {}
}

export class DeleteEffectFeedback implements Action {
  readonly type = EffectFeedbackActionTypes.DeleteEffectFeedback;

  constructor(public payload: { id: string }) {}
}

export class DeleteEffectFeedbacks implements Action {
  readonly type = EffectFeedbackActionTypes.DeleteEffectFeedbacks;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearEffectFeedbacks implements Action {
  readonly type = EffectFeedbackActionTypes.ClearEffectFeedbacks;
}

export type EffectFeedbackActions =
  | LoadEffectFeedbacks
  | AddEffectFeedback
  | UpsertEffectFeedback
  | AddEffectFeedbacks
  | UpsertEffectFeedbacks
  | UpdateEffectFeedback
  | UpdateEffectFeedbacks
  | DeleteEffectFeedback
  | DeleteEffectFeedbacks
  | ClearEffectFeedbacks;
