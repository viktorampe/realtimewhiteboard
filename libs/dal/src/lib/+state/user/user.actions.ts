import { Action } from '@ngrx/store';

export enum UserActionTypes {
  LoadUser = '[User] Load User',
  UserLoaded = '[User] User Loaded',
  UserLoadError = '[User] User Load Error',
  RemoveUser = '[User] Remove User',
  UserRemoved = '[User] User Removed',
  UserRemoveError = '[User] User Remove Error'
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
  constructor(public payload: any) {}
}

export class RemoveUser implements Action {
  readonly type = UserActionTypes.RemoveUser;
}

export class UserRemoved implements Action {
  readonly type = UserActionTypes.UserRemoved;
  constructor(public payload: any) {}
}

export class UserRemoveError implements Action {
  readonly type = UserActionTypes.UserRemoveError;
  constructor(public payload: any) {}
}

export type UserAction =
  | LoadUser
  | UserLoaded
  | UserLoadError
  | RemoveUser
  | UserRemoved
  | UserRemoveError;

export const fromUserActions = {
  LoadUser,
  UserLoaded,
  UserLoadError,
  RemoveUser,
  UserRemoved,
  UserRemoveError
};
