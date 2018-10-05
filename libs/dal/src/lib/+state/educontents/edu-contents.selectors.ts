import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll, State } from './edu-contents.reducer';

export const selectEduContentState = createFeatureSelector<State>(
  'eduContents'
);

export const getError = createSelector(
  selectEduContentState,
  (state: State) => state.error
);
export const selectAllEduContents = createSelector(
  selectEduContentState,
  selectAll
);

export const getLoaded = createSelector(
  selectEduContentState,
  (state: State) => state.loaded
);
