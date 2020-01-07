import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import { DalState, UserActions, UserQueries } from '@campus/dal';
import {
  EnvironmentLogoutInterface,
  ENVIRONMENT_LOGOUT_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogoutViewModel {
  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_LOGOUT_TOKEN)
    public environmentLogout: EnvironmentLogoutInterface,
    @Inject(WINDOW) private window: Window
  ) {}

  logout(): void {
    // this will trigger the clear-state meta-reducer which will reset the store to it's initial state
    this.store.dispatch(new UserActions.RemoveUser());
    this.store
      .pipe(
        select(UserQueries.getCurrentUser),
        filter(currentUser => !currentUser),
        take(1)
      )
      .subscribe(user => {
        this.window.location.assign(this.environmentLogout.url);
      });
  }
}
