import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { UserContentInterface } from '../../+models';

export enum UserContentsActionTypes {
  UserContentsLoaded = '[UserContents] UserContents Loaded',
  UserContentsLoadError = '[UserContents] Load Error',
  LoadUserContents = '[UserContents] Load UserContents',
  AddUserContent = '[UserContents] Add UserContent',
  UpsertUserContent = '[UserContents] Upsert UserContent',
  AddUserContents = '[UserContents] Add UserContents',
  UpsertUserContents = '[UserContents] Upsert UserContents',
  UpdateUserContent = '[UserContents] Update UserContent',
  UpdateUserContents = '[UserContents] Update UserContents',
  DeleteUserContent = '[UserContents] Delete UserContent',
  DeleteUserContents = '[UserContents] Delete UserContents',
  ClearUserContents = '[UserContents] Clear UserContents'
}

export class LoadUserContents implements Action {
  readonly type = UserContentsActionTypes.LoadUserContents;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class UserContentsLoaded implements Action {
  readonly type = UserContentsActionTypes.UserContentsLoaded;

  constructor(public payload: { userContents: UserContentInterface[] }) {}
}

export class UserContentsLoadError implements Action {
  readonly type = UserContentsActionTypes.UserContentsLoadError;
  constructor(public payload: any) {}
}

export class AddUserContent implements Action {
  readonly type = UserContentsActionTypes.AddUserContent;

  constructor(public payload: { userContent: UserContentInterface }) {}
}

export class UpsertUserContent implements Action {
  readonly type = UserContentsActionTypes.UpsertUserContent;

  constructor(public payload: { userContent: UserContentInterface }) {}
}

export class AddUserContents implements Action {
  readonly type = UserContentsActionTypes.AddUserContents;

  constructor(public payload: { userContents: UserContentInterface[] }) {}
}

export class UpsertUserContents implements Action {
  readonly type = UserContentsActionTypes.UpsertUserContents;

  constructor(public payload: { userContents: UserContentInterface[] }) {}
}

export class UpdateUserContent implements Action {
  readonly type = UserContentsActionTypes.UpdateUserContent;

  constructor(public payload: { userContent: Update<UserContentInterface> }) {}
}

export class UpdateUserContents implements Action {
  readonly type = UserContentsActionTypes.UpdateUserContents;

  constructor(
    public payload: { userContents: Update<UserContentInterface>[] }
  ) {}
}

export class DeleteUserContent implements Action {
  readonly type = UserContentsActionTypes.DeleteUserContent;

  constructor(public payload: { id: number }) {}
}

export class DeleteUserContents implements Action {
  readonly type = UserContentsActionTypes.DeleteUserContents;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearUserContents implements Action {
  readonly type = UserContentsActionTypes.ClearUserContents;
}

export type UserContentsActions =
  | LoadUserContents
  | UserContentsLoaded
  | UserContentsLoadError
  | AddUserContent
  | UpsertUserContent
  | AddUserContents
  | UpsertUserContents
  | UpdateUserContent
  | UpdateUserContents
  | DeleteUserContent
  | DeleteUserContents
  | ClearUserContents;
