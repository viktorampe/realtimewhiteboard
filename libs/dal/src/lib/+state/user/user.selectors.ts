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

const getAllUser = createSelector(
  getUserState,
  getLoaded,
  (state: UserState, isLoaded) => {
    return isLoaded ? state.list : [];
  }
);
const getSelectedId = createSelector(
  getUserState,
  (state: UserState) => state.selectedId
);
const getSelectedUser = createSelector(
  getAllUser,
  getSelectedId,
  (user, id) => {
    return user ? Object.assign({}, user) : undefined;
  }
);

export const userQuery = {
  getLoaded,
  getError,
  getAllUser,
  getSelectedUser
};
