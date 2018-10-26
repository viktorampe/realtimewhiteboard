import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './user.reducer';

// Lookup the 'User' feature state managed by NgRx
const getUserState = createFeatureSelector<State>('user');

export const getLoaded = createSelector(
  getUserState,
  (state: State) => state.loaded
);
export const getError = createSelector(
  getUserState,
  (state: State) => state.error
);

export const getCurrentUser = createSelector(
  getUserState,
  getLoaded,
  (state: State, isLoaded) => {
    return isLoaded ? state.currentUser : null;
  }
);
