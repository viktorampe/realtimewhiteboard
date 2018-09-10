import { Injectable, InjectionToken } from '@angular/core';
import { PersonsState } from '@campus/dal';
import { LoopBackAuth, PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PersonsActionTypes } from '../+state/persons/persons.actions';
import {
  AuthServiceInterface,
  LoginCredentials
} from './auth-service.interface';

export const AuthServiceToken = new InjectionToken('AuthService');

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {
  personState: Observable<PersonsState>;

  constructor(
    private personApi: PersonApi,
    private auth: LoopBackAuth,
    private store: Store<PersonsState>
  ) {
    this.personState = this.store.select('persons');
  }

  logout() {
    this.personApi.logout().subscribe(
      ob => {
        this.store.dispatch({
          type: PersonsActionTypes.PersonLoggedOut,
          payload: { loggedIn: false }
        });
      },
      err => {
        this.store.dispatch({
          type: PersonsActionTypes.PersonLoggedOut,
          payload: {}
        });
      }
    );
  }

  login(credentials: Partial<LoginCredentials>) {
    this.personApi.login(credentials).subscribe(
      loggedInCredentials => {
        console.log(loggedInCredentials);
        this.store.dispatch({
          type: PersonsActionTypes.PersonLoggedIn,
          payload: { loggedIn: true }
        });
        this.store.dispatch({
          type: PersonsActionTypes.PersonsLoaded,
          payload: { person: loggedInCredentials }
        });
      },
      err => {
        console.log('logged in failed');
        this.store.dispatch({
          type: PersonsActionTypes.PersonLoginError,
          payload: { loggedIn: false }
        });
      }
    );
  }
}
