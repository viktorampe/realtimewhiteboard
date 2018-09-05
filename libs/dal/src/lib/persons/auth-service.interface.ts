export interface LoginCredentials {
  email: string;
  password: string;
  username: string;
}

export interface AuthServiceInterface {
  logout();
  login(credentials: Partial<LoginCredentials>);
}
