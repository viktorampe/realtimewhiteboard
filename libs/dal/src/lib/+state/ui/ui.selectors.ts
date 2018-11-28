import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, UiState } from './ui.reducer';

// Lookup the 'Ui' feature state managed by NgRx
const getUiState = createFeatureSelector<UiState>(NAME);

const getLoaded = createSelector(
  getUiState,
  (state: UiState) => state.loaded
);

const getListFormat = createSelector(
  getUiState,
  (state: UiState) => state.listFormat
);

const getSideNavOpen = createSelector(
  getUiState,
  (state: UiState) => state.sideNavOpen
);

export const UiQuery = {
  getLoaded,
  getListFormat,
  getSideNavOpen
};
