import { Inject, Injectable } from '@angular/core';
import { DalState, UserActions } from '@campus/dal';
import {
  EnvironmentLogoutInterface,
  ENVIRONMENT_LOGOUT_TOKEN
} from '@campus/shared';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class LogoutViewModel {
  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_LOGOUT_TOKEN)
    public environmentLogout: EnvironmentLogoutInterface
  ) {}

  logout(): void {
    this.store.dispatch(new UserActions.RemoveUser());
    window.location.href = this.environmentLogout.url;
  }
}
