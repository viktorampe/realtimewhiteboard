import { Injectable, InjectionToken } from '@angular/core';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import { PassportUserCredentialInterface } from '../+models';

export const CREDENTIAL_SERVICE_TOKEN = new InjectionToken('CredentialService');

export interface CredentialServiceInterface {
  getAllForUser(userId: number): Observable<PassportUserCredentialInterface[]>;
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
}
