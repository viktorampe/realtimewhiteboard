import { Action } from '@ngrx/store';
import { PassportUserCredentialInterface } from '../../+models';

export enum CredentialsActionTypes {
  CredentialsLoaded = '[Credentials] Credentials Loaded',
  CredentialsLoadError = '[Credentials] Load Error',
  LoadCredentials = '[Credentials] Load Credentials',
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

export class UnlinkCredential implements Action {
  readonly type = CredentialsActionTypes.UnlinkCredential;

  constructor(
    public payload: { credential: PassportUserCredentialInterface }
  ) {}
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
  | UnlinkCredential
  | UseCredentialProfilePicture;
