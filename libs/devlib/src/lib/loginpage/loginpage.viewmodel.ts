import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import {
  AuthServiceInterface,
  AuthServiceToken,
  StudentContentStatusActions,
  StudentContentStatusReducer,
  StudentContentStatusService
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
    @Inject(AuthServiceToken) private authService: AuthServiceInterface,
    public studentContentStatusService: StudentContentStatusService,
    public studentContentStatusStore: Store<StudentContentStatusReducer.State>
  ) {
    this.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      this.loggedIn = isLoggedIn;
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
        console.log('logging in');
        this.authService
          .login({ username: name, password: password })
          .subscribe(loggedIn => {
            this.loggedIn = true;
          });
      } else {
        this.loggedIn = true;
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
        console.log('logging out');
        this.authService.logout().subscribe((loggedOut: any) => {
          this.loggedIn = false;
        });
      } else {
        this.loggedIn = false;
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
    this.studentContentStatusStore.dispatch(
      new StudentContentStatusActions.LoadStudentContentStatuses({
        studentId: 6
      })
    );

    return new BehaviorSubject<boolean>(true).pipe(take(1));
  }
}
