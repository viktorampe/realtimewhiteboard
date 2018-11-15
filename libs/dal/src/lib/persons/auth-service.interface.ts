import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
  username: string;
}

export const AUTH_SERVICE_TOKEN = new InjectionToken('AuthService');

export interface AuthServiceInterface {
  userId: number;
  getCurrent(): Observable<any>;
  logout(): Observable<any>;
  login(credentials: Partial<LoginCredentials>): Observable<any>;
  isLoggedIn(): boolean;
}
