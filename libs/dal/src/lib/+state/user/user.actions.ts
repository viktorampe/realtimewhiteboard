import { PersonInterface } from '@campus/dal';
import { Action } from '@ngrx/store';
import { State } from './user.reducer';

export enum UserActionTypes {
  LoadUser = '[User] Load User',
  UserLoaded = '[User] User Loaded',
  UserLoadError = '[User] User Load Error',
  RemoveUser = '[User] Remove User',
  UserRemoved = '[User] User Removed',
  UserRemoveError = '[User] User Remove Error',
  LogInUser = '[User] Log In User',
  UpdateUser = '[User] Update User',
  UserUpdateMessage = '[User] User Update Message',
  LoadPermissions = '[User] Load Permissions',
  PermissionsLoaded = '[User] Permissions Loaded',
  PermissionsLoadError = '[User] Permissions Load error'
}

export class LogInUser implements Action {
  readonly type = UserActionTypes.LogInUser;
  constructor(public payload: { username: string; password: string }) {}
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

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(
    public payload: { userId: number; changedProps: Partial<PersonInterface> }
  ) {}
}

export class UserUpdateMessage implements Action {
  readonly type = UserActionTypes.UserUpdateMessage;
  constructor(public payload: State['lastUpdateMessage']) {}
}

export class LoadPermissions implements Action {
  readonly type = UserActionTypes.LoadPermissions;
  constructor(public payload: { force?: boolean }) {}
}

export class PermissionsLoaded implements Action {
  readonly type = UserActionTypes.PermissionsLoaded;
  constructor(public payload: string[]) {}
}

export class PermissionsLoadError implements Action {
  readonly type = UserActionTypes.PermissionsLoadError;
  constructor(public payload: { error: any }) {}
}

export type UserAction =
  | LoadUser
  | UserLoaded
  | UserLoadError
  | RemoveUser
  | UserRemoved
  | UserRemoveError
  | LogInUser
  | UpdateUser
  | UserUpdateMessage
  | LoadPermissions
  | PermissionsLoaded
  | PermissionsLoadError;

export const fromUserActions = {
  LoadUser,
  UserLoaded,
  UserLoadError,
  RemoveUser,
  UserRemoved,
  UserRemoveError,
  LogInUser,
  UpdateUser,
  UserUpdateMessage,
  LoadPermissions,
  PermissionsLoaded,
  PermissionsLoadError
};
