import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.reducer';

// Lookup the 'Ui' feature state managed by NgRx
const getUiState = createFeatureSelector<UiState>('ui');

const getLoaded = createSelector(getUiState, (state: UiState) => state.loaded);
const getError = createSelector(getUiState, (state: UiState) => state.error);

const getAllUi = createSelector(
  getUiState,
  getLoaded,
  (state: UiState, isLoaded) => {
    return isLoaded ? state : {};
  }
);

export const uiQuery = {
  getLoaded,
  getError,
  getAllUi
};
