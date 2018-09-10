import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import {
  LoadPersons,
  PersonLoggedIn,
  PersonLoggedOut,
  PersonLogin,
  PersonLoginError,
  PersonLogout,
  PersonLogoutError,
  PersonsActionTypes,
  PersonsLoaded,
  PersonsLoadError
} from './persons.actions';
import { PersonsState } from './persons.reducer';

@Injectable()
export class PersonsEffects {
  @Effect()
  loadPersons$ = this.dataPersistence.fetch(PersonsActionTypes.LoadPersons, {
    run: (action: LoadPersons, state: PersonsState) => {
      // Your custom REST 'load' logic goes here. For now just return an empty list...
      return new PersonsLoaded({});
    },

    onError: (action: LoadPersons, error) => {
      console.error('Error', error);
      return new PersonsLoadError(error);
    }
  });

  @Effect()
  loginPerson$ = this.dataPersistence.fetch(PersonsActionTypes.PersonLogin, {
    run: (action: PersonLogin, state: PersonsState) => {
      return new PersonLoggedIn(false);
    },
    onError: (action: PersonLogin, error) => {
      return new PersonLoginError(error);
    }
  });

  @Effect()
  logoutPerson$ = this.dataPersistence.fetch(PersonsActionTypes.PersonLogout, {
    run: (action: PersonLogout, state: PersonsState) => {
      return new PersonLoggedOut(false);
    },
    onError: (action: PersonLogout, error) => {
      return new PersonLogoutError(error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<PersonsState>
  ) {}
}
