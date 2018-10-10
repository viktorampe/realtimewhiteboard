import { PersonInterface } from '@campus/dal';
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
  constructor(public payload: { force?: boolean }) {}
}

export class UserLoadError implements Action {
  readonly type = UserActionTypes.UserLoadError;
  constructor(public payload: { error: any }) {}
}

export class UserLoaded implements Action {
  readonly type = UserActionTypes.UserLoaded;
  constructor(public payload: PersonInterface) {}
}

export class RemoveUser implements Action {
  readonly type = UserActionTypes.RemoveUser;
  constructor() {}
}

export class UserRemoved implements Action {
  readonly type = UserActionTypes.UserRemoved;
  constructor() {}
}

export class UserRemoveError implements Action {
  readonly type = UserActionTypes.UserRemoveError;
  constructor(public payload: { error: any }) {}
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
