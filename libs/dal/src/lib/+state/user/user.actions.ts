import { Action } from '@ngrx/store';
import { PersonInterface } from '../../+models/Person.interface';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum UserActionTypes {
  LoadUser = '[User] Load User',
  UserLoaded = '[User] User Loaded',
  UserLoadError = '[User] User Load Error',
  RemoveUser = '[User] Remove User',
  UserRemoved = '[User] User Removed',
  UserRemoveError = '[User] User Remove Error',
  LogInUser = '[User] Log In User',
  UpdateUser = '[User] Update User',
  LoadPermissions = '[User] Load Permissions',
  PermissionsLoaded = '[User] Permissions Loaded',
  PermissionsLoadError = '[User] Permissions Load error'
}

export class LogInUser implements FeedbackTriggeringAction {
  readonly type = UserActionTypes.LogInUser;
  constructor(
    public payload: {
      username?: string;
      email?: string;
      password: string;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
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

// the RemoveUser action will trigger the clear-state meta-reducer which will reset the store to it's initial state
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

export class UpdateUser implements FeedbackTriggeringAction {
  readonly type = UserActionTypes.UpdateUser;
  constructor(
    public payload: {
      userId: number;
      changedProps: Partial<PersonInterface>;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
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
  LoadPermissions,
  PermissionsLoaded,
  PermissionsLoadError
};
