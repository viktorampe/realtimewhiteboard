import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

// Lookup the 'User' feature state managed by NgRx
const getUserState = createFeatureSelector<UserState>('user');

export const getLoaded = createSelector(
  getUserState,
  (state: UserState) => state.loaded
);
export const getError = createSelector(
  getUserState,
  (state: UserState) => state.error
);

export const getCurrentUser = createSelector(
  getUserState,
  getLoaded,
  (state: UserState, isLoaded) => {
    return isLoaded ? state.currentUser : null;
  }
);
