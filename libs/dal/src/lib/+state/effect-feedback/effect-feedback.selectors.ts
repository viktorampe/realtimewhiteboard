import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EffectFeedbackInterface } from './effect-feedback.model';
import { NAME, selectAll, State } from './effect-feedback.reducer';

export const selectEffectFeedbackState = createFeatureSelector<State>(NAME);

export const getAll = createSelector(
  selectEffectFeedbackState,
  selectAll
);

export const getNext = createSelector(
  selectAll,
  (effectFeedback: EffectFeedbackInterface[]) => {
    return effectFeedback[0];
  }
);
