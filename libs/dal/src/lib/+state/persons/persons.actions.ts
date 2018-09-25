import { Action } from '@ngrx/store';
import { PersonEntity } from './persons.reducer';

export enum PersonsActionTypes {
  PersonLogin = '[Persons] Person Login',
  PersonLoggedIn = '[Persons] Person Logged In',
  PersonLoginError = '[Persons] Persons Login error',
  PersonLogout = '[Persons] Person Logout',
  PersonLoggedOut = '[Persons] Person Logged Out',
  PersonLogoutError = '[Persons] Persons Logout error',
  LoadPersons = '[Persons] Load Persons',
  PersonsLoaded = '[Persons] Persons Loaded',
  PersonsLoadError = '[Persons] Persons Load Error'
}

export class PersonLogin implements Action {
  readonly type = PersonsActionTypes.PersonLogin;
}

export class PersonLoggedIn implements Action {
  readonly type = PersonsActionTypes.PersonLoggedIn;
  constructor(public payload: boolean) {}
}

export class PersonLoginError implements Action {
  readonly type = PersonsActionTypes.PersonLoginError;
  constructor(public error: any) {}
}

export class PersonLogout implements Action {
  readonly type = PersonsActionTypes.PersonLogout;
}

export class PersonLoggedOut implements Action {
  readonly type = PersonsActionTypes.PersonLoggedOut;
  constructor(public payload: boolean) {}
}

export class PersonLogoutError implements Action {
  readonly type = PersonsActionTypes.PersonLogoutError;
  constructor(public error: any) {}
}

export class LoadPersons implements Action {
  readonly type = PersonsActionTypes.LoadPersons;
}

export class PersonsLoadError implements Action {
  readonly type = PersonsActionTypes.PersonsLoadError;
  constructor(public payload: any) {}
}

export class PersonsLoaded implements Action {
  readonly type = PersonsActionTypes.PersonsLoaded;
  constructor(public payload: PersonEntity[]) {}
}

export type PersonsAction =
  | LoadPersons
  | PersonsLoaded
  | PersonsLoadError
  | PersonLogin
  | PersonLoggedIn
  | PersonLoginError
  | PersonLogout
  | PersonLoggedOut
  | PersonLogoutError;

export const fromPersonsActions = {
  LoadPersons,
  PersonsLoaded,
  PersonsLoadError,
  PersonLogin,
  PersonLoggedIn,
  PersonLoginError,
  PersonLogout,
  PersonLoggedOut,
  PersonLogoutError
};
