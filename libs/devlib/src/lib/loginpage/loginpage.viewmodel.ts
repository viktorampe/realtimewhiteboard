import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  UserActions,
  UserQueries,
  UserReducer
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { fromUserActions } from './../../../../dal/src/lib/+state/user/user.actions';

@Injectable({
  providedIn: 'root'
})
export class LoginPageViewModel implements Resolve<boolean> {
  name: string;
  password: string;
  response: string;

  loggedIn: boolean;

  constructor(
    private store: Store<UserReducer.State>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    store.pipe(select(UserQueries.getCurrentUser)).subscribe(data => {
      this.loggedIn = data != null;
    });
  }

  /**
   * checks whether the user is logged in, returns a boolean
   *
   * @returns {Observable<boolean>}
   * @memberof LoginPageViewModel
   */
  isLoggedIn(): Observable<boolean> {
    console.log('inside isLoggedIn');
    return this.authService.isAuthenticated();
  }

  /**
   * logs in the user
   *
   * @param {string} name
   * @param {string} password
   * @memberof LoginPageViewModel
   */
  login(name: string, password: string) {
    this.isLoggedIn().subscribe(isLoggedIn => {
      console.log('login', isLoggedIn);

      if (isLoggedIn) {
        console.error('login failed since we are already logged in');
        this.store.dispatch(new fromUserActions.LoadUser({ force: false }));
      } else {
        this.store.dispatch(
          new fromUserActions.LogInUser({
            username: name,
            password: password
          })
        );
      }
      return;
    });
  }

  /**
   * logs out the user
   *
   * @param {string} name
   * @param {string} password
   * @memberof LoginPageViewModel
   */
  logout(): void {
    this.isLoggedIn().subscribe(isLoggedIn => {
      console.log('logout', isLoggedIn);
      if (isLoggedIn) {
        this.store.dispatch(new UserActions.RemoveUser());
      } else {
        console.error('logout failed');
      }
    });
  }

  /**
   * initializes the LoginPageViewModel
   *
   * @returns {boolean} not used, returning boolean so the resolver will work
   *
   * @memberOf LoginPageViewModel
   */
  resolve(): Observable<boolean> {
    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }
}
