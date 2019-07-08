import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';
import {
  AddEffectFeedback,
  DeleteEffectFeedback,
  EffectFeedbackActionTypes
} from './effect-feedback.actions';

@Injectable()
export class EffectFeedbackEffects {
  @Effect()
  addNewSuccessEffectFeedback$ = this.actions.pipe(
    ofType(EffectFeedbackActionTypes.AddEffectFeedback),
    filter((action: AddEffectFeedback) => {
      const customHandlers =
        action.payload.effectFeedback.triggerAction.payload
          .customFeedbackHandlers;
      return (
        action.payload.effectFeedback.type === 'success' &&
        customHandlers &&
        customHandlers.useCustomSuccessHandler === 'useNoHandler'
      );
    }),
    map((action: AddEffectFeedback) => {
      return new DeleteEffectFeedback({
        id: action.payload.effectFeedback.id
      });
    })
  );
  @Effect()
  addNewErrorEffectFeedback$ = this.actions.pipe(
    ofType(EffectFeedbackActionTypes.AddEffectFeedback),
    filter((action: AddEffectFeedback) => {
      const customHandlers =
        action.payload.effectFeedback.triggerAction.payload
          .customFeedbackHandlers;
      return (
        action.payload.effectFeedback.type === 'error' &&
        customHandlers &&
        customHandlers.useCustomErrorHandler === 'useNoHandler'
      );
    }),
    map((action: AddEffectFeedback) => {
      return new DeleteEffectFeedback({
        id: action.payload.effectFeedback.id
      });
    })
  );

  constructor(private actions: Actions) {}
}
