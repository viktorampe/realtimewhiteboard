import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { PassportUserCredentialInterface } from '../../+models';

export enum CredentialsActionTypes {
  CredentialsLoaded = '[Credentials] Credentials Loaded',
  CredentialsLoadError = '[Credentials] Load Error',
  LoadCredentials = '[Credentials] Load Credentials',
  AddCredential = '[Credentials] Add Credential',
  UpsertCredential = '[Credentials] Upsert Credential',
  AddCredentials = '[Credentials] Add Credentials',
  UpsertCredentials = '[Credentials] Upsert Credentials',
  UpdateCredential = '[Credentials] Update Credential',
  UpdateCredentials = '[Credentials] Update Credentials',
  DeleteCredential = '[Credentials] Delete Credential',
  DeleteCredentials = '[Credentials] Delete Credentials',
  ClearCredentials = '[Credentials] Clear Credentials',
  UnlinkCredential = '[Credentials] Unlink Credential',
  UseCredentialProfilePicture = '[Credentials] Use Credential ProfilePicture'
}

export class LoadCredentials implements Action {
  readonly type = CredentialsActionTypes.LoadCredentials;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class CredentialsLoaded implements Action {
  readonly type = CredentialsActionTypes.CredentialsLoaded;

  constructor(
    public payload: { credentials: PassportUserCredentialInterface[] }
  ) {}
}

export class CredentialsLoadError implements Action {
  readonly type = CredentialsActionTypes.CredentialsLoadError;
  constructor(public payload: any) {}
}

export class AddCredential implements Action {
  readonly type = CredentialsActionTypes.AddCredential;

  constructor(
    public payload: { credential: PassportUserCredentialInterface }
  ) {}
}

export class UpsertCredential implements Action {
  readonly type = CredentialsActionTypes.UpsertCredential;

  constructor(
    public payload: { credential: PassportUserCredentialInterface }
  ) {}
}

export class AddCredentials implements Action {
  readonly type = CredentialsActionTypes.AddCredentials;

  constructor(
    public payload: { credentials: PassportUserCredentialInterface[] }
  ) {}
}

export class UpsertCredentials implements Action {
  readonly type = CredentialsActionTypes.UpsertCredentials;

  constructor(
    public payload: { credentials: PassportUserCredentialInterface[] }
  ) {}
}

export class UpdateCredential implements Action {
  readonly type = CredentialsActionTypes.UpdateCredential;

  constructor(
    public payload: { credential: Update<PassportUserCredentialInterface> }
  ) {}
}

export class UpdateCredentials implements Action {
  readonly type = CredentialsActionTypes.UpdateCredentials;

  constructor(
    public payload: { credentials: Update<PassportUserCredentialInterface>[] }
  ) {}
}

export class DeleteCredential implements Action {
  readonly type = CredentialsActionTypes.DeleteCredential;

  constructor(public payload: { id: number }) {}
}

export class DeleteCredentials implements Action {
  readonly type = CredentialsActionTypes.DeleteCredentials;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearCredentials implements Action {
  readonly type = CredentialsActionTypes.ClearCredentials;
}

export class UnlinkCredential implements Action {
  readonly type = CredentialsActionTypes.UnlinkCredential;

  constructor(public payload: { id: number }) {}
}

export class UseCredentialProfilePicture implements Action {
  readonly type = CredentialsActionTypes.UseCredentialProfilePicture;

  constructor(
    public payload: { credential: PassportUserCredentialInterface }
  ) {}
}

export type CredentialsActions =
  | LoadCredentials
  | CredentialsLoaded
  | CredentialsLoadError
  | AddCredential
  | UpsertCredential
  | AddCredentials
  | UpsertCredentials
  | UpdateCredential
  | UpdateCredentials
  | DeleteCredential
  | DeleteCredentials
  | ClearCredentials
  | UnlinkCredential
  | UseCredentialProfilePicture;
