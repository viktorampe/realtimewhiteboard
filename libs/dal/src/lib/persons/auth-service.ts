import { Injectable } from '@angular/core';
import {
  LoopBackAuth,
  PersonApi,
  PersonInterface
} from '@diekeure/polpo-api-angular-sdk';
import { Observable } from 'rxjs';
import {
  AuthServiceInterface,
  LoginCredentials
} from './auth-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {
  get userId(): number {
    return this.personApi.getCurrentId();
  }

  constructor(private personApi: PersonApi, private auth: LoopBackAuth) {}

  /**
   * gets the current logged in user, throws a 401 error if not logged in
   *
   * @returns {Observable<any>}
   * @memberof AuthService
   */
  getCurrent(): Observable<PersonInterface> {
    return this.personApi.getCurrent();
  }

  /**
   * logs out the current user this method returns no data.
   *
   * @returns {Observable<any>}
   * @memberof AuthService
   */
  logout(): Observable<any> {
    return this.personApi.logout();
  }

  /**
   * logs in the current user,
   * The response body contains properties of the AccessToken created on login.
   * Depending on the value of `include` parameter, the body may contain additional properties:
   *
   * @param {Partial<LoginCredentials>} credentials
   * @returns {Observable<any>}
   * @memberof AuthService
   */
  login(credentials: Partial<LoginCredentials>): Observable<any> {
    return this.personApi.login(credentials);
  }
}
