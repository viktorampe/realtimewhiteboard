import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, State } from './effect-feedback.reducer';

export const selectEffectFeedbackState = createFeatureSelector<State>(NAME);

export const getNext = createSelector(
  selectEffectFeedbackState,
  (state: State) => {
    // only return the feedback with display true
    const filteredIds = (state.ids as string[]).filter(
      id => state.entities[id].display
    );
    return state.entities[filteredIds[0]];
  }
);
