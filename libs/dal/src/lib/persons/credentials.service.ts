import { Injectable, InjectionToken } from '@angular/core';
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
  public getAllForUser(
    userId: number
  ): Observable<PassportUserCredentialInterface[]> {
    return;
  }
}
