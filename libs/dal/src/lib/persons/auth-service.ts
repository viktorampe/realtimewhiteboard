import { Injectable, InjectionToken } from '@angular/core';
import { LoopBackAuth, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Observable } from '../../../../../node_modules/rxjs';
import {
  AuthServiceInterface,
  LoginCredentials
} from './auth-service.interface';

export const AuthServiceToken = new InjectionToken('AuthService');

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {
  constructor(private personApi: PersonApi, private auth: LoopBackAuth) {}

  login(credentials: Partial<LoginCredentials>): Observable<Object> {
    return this.personApi.login(credentials);
  }
}
