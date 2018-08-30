import { Observable } from '../../../../node_modules/rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
  username: string;
}

export interface AuthServiceInterface {
  login(credentials: Partial<LoginCredentials>): Observable<Object>;
}
