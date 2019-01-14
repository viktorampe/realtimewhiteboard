import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { PassportUserCredentialInterface } from '../+models';

export const CREDENTIAL_SERVICE_TOKEN = new InjectionToken('CredentialService');

export interface CredentialServiceInterface {
  getAllForUser(userId: number): Observable<PassportUserCredentialInterface[]>;
  unlinkCredential(
    credential: PassportUserCredentialInterface
  ): Observable<boolean>;
  useCredentialProfilePicture(
    credential: PassportUserCredentialInterface
  ): Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class CredentialService implements CredentialServiceInterface {
  constructor(private personApi: PersonApi) {}

  public getAllForUser(
    userId: number
  ): Observable<PassportUserCredentialInterface[]> {
    return this.personApi.getCredentials(userId);
  }

  unlinkCredential(
    credential: PassportUserCredentialInterface
  ): Observable<boolean> {
    return this.personApi
      .destroyByIdCredentials(credential.userId, credential.id)
      .pipe(mapTo(true));
  }
  useCredentialProfilePicture(
    credential: PassportUserCredentialInterface
  ): Observable<boolean> {
    return this.personApi
      .useAvatarFromCredential(credential.userId, credential.id)
      .pipe(mapTo(true));
  }
}
