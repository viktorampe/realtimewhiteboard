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
import {
  WindowServiceInterface,
  WINDOW_SERVICE_TOKEN
} from 'libs/browser/src/lib/window/window.service.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

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
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(WINDOW_SERVICE_TOKEN) private windowService: WindowServiceInterface
  ) {
    store.pipe(select(UserQueries.getCurrentUser)).subscribe(data => {
      this.loggedIn = data != null;
    });
    windowService.openWindow('lalala', 'www.google.com');
    windowService.closeWindow('foo');
  }

  /**
   * checks whether the user is logged in, returns a boolean
   *
   * @returns {Observable<boolean>}
   * @memberof LoginPageViewModel
   */
  isLoggedIn(): Observable<boolean> {
    return this.authService.getCurrent().pipe(
      map(() => {
        return true;
      }),
      catchError(err => {
        return of(false);
      })
    );
  }

  /**
   * logs in the user
   *
   * @param {string} name
   * @param {string} password
   * @memberof LoginPageViewModel
   */
  login(name: string, password: string): void {
    this.isLoggedIn()
      .pipe(
        switchMap(loggedin => {
          if (loggedin) {
            throw new Error('login failed since we are already logged in');
          }
          return this.authService.login({ username: name, password: password });
        })
      )
      .subscribe(() => {
        this.store.dispatch(new UserActions.LoadUser({ force: false }));
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
    this.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.store.dispatch(new UserActions.RemoveUser());
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
