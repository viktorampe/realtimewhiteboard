import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  AuthServiceInterface,
  AuthServiceToken,
  LoadUser,
  RemoveUser,
  userQuery,
  UserState
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginPageViewModel implements Resolve<boolean> {
  name: string;
  password: string;
  response: string;

  loggedIn: boolean;

  constructor(
    private store: Store<UserState>,
    @Inject(AuthServiceToken) private authService: AuthServiceInterface
  ) {
    store.select(userQuery.getSelectedUser).subscribe(data => {
      console.log('got event', data, Object.getOwnPropertyNames(data).length);
      if (Object.getOwnPropertyNames(data).length === 0) {
        console.log('not logged in');
        this.loggedIn = false;
      } else {
        console.log('logged in');
        this.loggedIn = true;
      }
    });
  }

  /**
   * checks whether the user is logged in, returns a boolean
   *
   * @returns {Observable<boolean>}
   * @memberof LoginPageViewModel
   */
  isLoggedIn(): Observable<boolean> {
    return this.authService.getCurrent().pipe(
      map((currentUser: any) => {
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
    this.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        this.authService
          .login({ username: name, password: password })
          .subscribe(
            loggedIn => {
              console.log("we successfully logged in let's call our dispatch");
              this.store.dispatch(new LoadUser());
            },
            error => {
              console.log(error);
            }
          );
      }
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
        this.store.dispatch(new RemoveUser());
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
