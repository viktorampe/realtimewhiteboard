import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  UserActions,
  UserReducer
} from '@campus/dal';
import {
  ScormApiServiceInterface,
  SCORM_API_SERVICE_TOKEN
} from '@campus/scorm';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginPageViewModel {
  name: string;
  password: string;
  response: string;

  constructor(
    private store: Store<UserReducer.State>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(SCORM_API_SERVICE_TOKEN)
    private scormApiService: ScormApiServiceInterface
  ) {
    if (this.isLoggedIn()) {
      store.dispatch(new UserActions.LoadUser({ force: false }));
    }
  }

  /**
   * checks whether the user is logged in, returns a boolean
   *
   * @returns {Observable<boolean>}
   * @memberof LoginPageViewModel
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * logs in the user
   *
   * @param {string} name
   * @param {string} password
   * @memberof LoginPageViewModel
   */
  login(name: string, password: string) {
    if (this.isLoggedIn()) {
      console.error('login failed since we are already logged in');
      this.store.dispatch(new UserActions.LoadUser({ force: false }));
    } else {
      this.store.dispatch(
        new UserActions.LogInUser({
          username: name,
          password: password
        })
      );
    }
    return;
  }

  /**
   * logs out the user
   *
   * @param {string} name
   * @param {string} password
   * @memberof LoginPageViewModel
   */
  logout(): void {
    if (this.isLoggedIn) {
      this.store.dispatch(new UserActions.RemoveUser());
    } else {
      console.error('logout failed');
    }
  }
}
