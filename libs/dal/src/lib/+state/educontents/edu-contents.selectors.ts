import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EduContentsState, selectAll } from './edu-contents.reducer';

const selectEduContentState = createFeatureSelector<EduContentsState>(
  'eduContents'
);

const getError = createSelector(
  selectEduContentState,
  (state: EduContentsState) => state.error
);
const selectAllEduContents = createSelector(selectEduContentState, selectAll);

const getLoaded = createSelector(
  selectEduContentState,
  (state: EduContentsState) => state.loaded
);

export const EDUCONTENT_QUERY = {
  getLoaded,
  getError,
  selectAllEduContents
};
