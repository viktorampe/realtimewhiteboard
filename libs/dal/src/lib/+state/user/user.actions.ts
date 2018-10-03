import { Action } from '@ngrx/store';

export enum UserActionTypes {
  LoadUser = '[User] Load User',
  UserLoaded = '[User] User Loaded',
  UserLoadError = '[User] User Load Error'
}

export class LoadUser implements Action {
  readonly type = UserActionTypes.LoadUser;
}

export class UserLoadError implements Action {
  readonly type = UserActionTypes.UserLoadError;
  constructor(public payload: any) {}
}

export class UserLoaded implements Action {
  readonly type = UserActionTypes.UserLoaded;
  constructor(public payload: any[]) {}
}

export type UserAction = LoadUser | UserLoaded | UserLoadError;

export const fromUserActions = {
  LoadUser,
  UserLoaded,
  UserLoadError
};
