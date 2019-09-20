import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  StudentContentStatusActions,
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

  updateStudentContentStatus() {
    this.store.dispatch(
      new StudentContentStatusActions.UpdateStudentContentStatus({
        studentContentStatus: {
          id: 1,
          changes: { contentStatusId: 3, unlockedContentId: 5 }
        }
      })
    );
  }

  updateAlert() {
    this.store.dispatch(
      new AlertActions.SetReadAlert({ personId: 1, alertIds: 58, read: true })
    );
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
