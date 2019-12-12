import { Inject, Injectable } from '@angular/core';
import {
  DalState,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import {
  EnvironmentLoginInterface,
  ENVIRONMENT_LOGIN_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginViewModel {
  public currentUser$: Observable<PersonInterface>;
  public loginPresets = this.environmentLogin.loginPresets;

  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_LOGIN_TOKEN)
    private environmentLogin: EnvironmentLoginInterface
  ) {
    this.setupStreams();
  }

  public login(username: string, password: string) {
    this.store.dispatch(new UserActions.LogInUser({ username, password }));
  }
  public logout() {
    this.store.dispatch(new UserActions.RemoveUser());
  }

  private setupStreams() {
    this.currentUser$ = this.store.pipe(select(UserQueries.getCurrentUser));
  }
}
