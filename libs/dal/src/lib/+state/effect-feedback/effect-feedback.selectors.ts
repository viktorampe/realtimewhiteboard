import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, State } from './effect-feedback.reducer';

export const selectEffectFeedbackState = createFeatureSelector<State>(NAME);

export const getNext = createSelector(
  selectEffectFeedbackState,
  (state: State) => {
    // only return the feedback with display true
    const reducer = (
      acc: number[] | string[],
      currentValue: number | string
    ) => {
      if (state.entities[currentValue].display) return [...acc, currentValue];
      return acc;
    };

    const filteredIds = (state.ids as string[]).reduce(reducer, []);
    return state.entities[filteredIds[0]];
  }
);
