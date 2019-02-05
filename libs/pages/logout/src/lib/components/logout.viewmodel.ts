import { Inject, Injectable } from '@angular/core';
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
    public environmentLogout: EnvironmentLogoutInterface
  ) {}

  logout(): void {
    this.store.dispatch(new UserActions.RemoveUser());
    this.store
      .pipe(
        select(UserQueries.getCurrentUser),
        filter(currentUser => !currentUser),
        take(1)
      )
      .subscribe(() => (window.location.href = this.environmentLogout.url));
  }
}
