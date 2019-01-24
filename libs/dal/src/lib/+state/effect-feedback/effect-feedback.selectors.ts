import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, State } from './effect-feedback.reducer';

export const selectEffectFeedbackState = createFeatureSelector<State>(NAME);

export const getNext = createSelector(
  selectEffectFeedbackState,
  (state: State) => {
    return state.entities[state.ids[0]];
  }
);
