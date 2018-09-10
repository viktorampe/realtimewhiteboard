import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PersonsState } from './persons.reducer';

// Lookup the 'Persons' feature state managed by NgRx
const getPersonsState = createFeatureSelector<PersonsState>('persons');

const getLoaded = createSelector(
  getPersonsState,
  (state: PersonsState) => state.loaded
);
const getError = createSelector(
  getPersonsState,
  (state: PersonsState) => state.error
);

const getAllPersons = createSelector(
  getPersonsState,
  getLoaded,
  (state: PersonsState, isLoaded) => {
    return isLoaded ? state.person : [];
  }
);

const getLoggedIn = createSelector(
  getPersonsState,
  (state: PersonsState) => state.loggedIn
);

const getLoginError = createSelector(
  getPersonsState,
  (state: PersonsState) => state.error
);

const getLoggedOut = createSelector(
  getPersonsState,
  (state: PersonsState) => !state.loggedIn
);

const getLogoutError = createSelector(
  getPersonsState,
  (state: PersonsState) => state.error
);

const getSelectedId = createSelector(
  getPersonsState,
  (state: PersonsState) => state.selectedId
);
const getSelectedPersons = createSelector(
  getAllPersons,
  getSelectedId,
  (persons, id) => {
    const result = persons;
    return result ? Object.assign({}, result) : undefined;
  }
);

export const personsQuery = {
  getLoaded,
  getError,
  getAllPersons,
  getSelectedPersons,
  getLoggedIn,
  getLoginError,
  getLoggedOut,
  getLogoutError
};
