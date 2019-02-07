import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NAME, State } from './user.reducer';

// Lookup the 'User' feature state managed by NgRx
const getUserState = createFeatureSelector<State>(NAME);

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
  (state: State) => state.currentUser
);

export const getPermissionsLoaded = createSelector(
  getUserState,
  (state: State) => state.permissionsLoaded
);

export const getPermissions = createSelector(
  getUserState,
  (state: State) => state.permissions
);
