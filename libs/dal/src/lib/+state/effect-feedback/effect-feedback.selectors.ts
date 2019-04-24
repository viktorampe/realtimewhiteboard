import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EffectFeedbackInterface } from '.';
import { NAME, State } from './effect-feedback.reducer';

export const selectEffectFeedbackState = createFeatureSelector<State>(NAME);

export const getNext = createSelector(
  selectEffectFeedbackState,
  (state: State) => {
    // only return the feedback with display true
    const filteredId = (state.ids as string[]).find(
      id => state.entities[id].display
    );

    if (!filteredId) {
      return;
    } else {
      return state.entities[filteredId];
    }
  }
);

export const getNextSuccess = createSelector(
  getNext,
  (feedback: EffectFeedbackInterface) => {
    if (feedback && feedback.type === 'success') {
      return feedback;
    } else {
      return; // I want undefined to return
    }
  }
);

export const getNextError = createSelector(
  getNext,
  (feedback: EffectFeedbackInterface) => {
    if (feedback && feedback.type === 'error') {
      return feedback;
    } else {
      return; // I want undefined to return
    }
  }
);
export const getFeedbackForAction = createSelector(
  selectEffectFeedbackState,
  (state: State, props: { actionType: string }) => {
    const filteredId = (state.ids as string[]).find(id => {
      return state.entities[id].triggerAction.type === props.actionType;
    });
    return state.entities[filteredId];
  }
);
