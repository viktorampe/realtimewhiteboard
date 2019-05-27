import { Action } from '@ngrx/store';
import { EffectFeedbackInterface } from './effect-feedback.model';

export enum EffectFeedbackActionTypes {
  AddEffectFeedback = '[EffectFeedback] Add EffectFeedback',
  DeleteEffectFeedback = '[EffectFeedback] Delete EffectFeedback'
}

export class AddEffectFeedback implements Action {
  readonly type = EffectFeedbackActionTypes.AddEffectFeedback;

  constructor(public payload: { effectFeedback: EffectFeedbackInterface }) {}
}

export class DeleteEffectFeedback implements Action {
  readonly type = EffectFeedbackActionTypes.DeleteEffectFeedback;

  constructor(public payload: { id: string; userAction?: Action }) {}
}

export type EffectFeedbackActions = AddEffectFeedback | DeleteEffectFeedback;
