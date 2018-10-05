import { Observable } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
  username: string;
}

export interface AuthServiceInterface {
  getCurrent(): Observable<any>;
  logout(): Observable<any>;
  login(credentials: Partial<LoginCredentials>): Observable<any>;
}
