import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  UserActions,
  UserReducer
} from '@campus/dal';
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
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

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
    if (!this.isLoggedIn()) {
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
      // this will trigger the clear-state meta-reducer which will reset the store to it's initial state
      this.store.dispatch(new UserActions.RemoveUser());
    } else {
      console.error('logout failed');
    }
  }
}
