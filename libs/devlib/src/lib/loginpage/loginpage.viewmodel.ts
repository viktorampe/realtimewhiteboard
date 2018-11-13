import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  UserActions,
  UserReducer
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginPageViewModel implements Resolve<boolean>, OnDestroy {
  name: string;
  password: string;
  response: string;
  subscriptions = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  constructor(
    private store: Store<UserReducer.State>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
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
    return this.authService.hasCookie();
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

      // avoids issue with loopback token
      // it is not set correctly on login
      this.subscriptions.add(
        this.store.subscribe(x => {
          // wait for cookies to be set
          if (this.isLoggedIn()) {
            window.location.reload(false);
          }
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
