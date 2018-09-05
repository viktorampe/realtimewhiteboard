import { Injectable, InjectionToken } from '@angular/core';
import { LoopBackAuth, PersonApi } from '@diekeure/polpo-api-angular-sdk';
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

  logout() {
    this.personApi.logout();
  }

  login(credentials: Partial<LoginCredentials>) {
    this.personApi.login(credentials);
  }
}
