import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

// Lookup the 'User' feature state managed by NgRx
const getUserState = createFeatureSelector<UserState>('user');

const getLoaded = createSelector(
  getUserState,
  (state: UserState) => state.loaded
);
const getError = createSelector(
  getUserState,
  (state: UserState) => state.error
);

const getCurrentUser = createSelector(
  getUserState,
  getLoaded,
  (state: UserState, isLoaded) => {
    return isLoaded ? state.currentUser : [];
  }
);
const getSelectedUser = createSelector(getCurrentUser, user => {
  return user ? Object.assign({}, user) : undefined;
});

export const userQuery = {
  getLoaded,
  getError,
  getCurrentUser,
  getSelectedUser
};
