import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@campus/browser';
import {
  DalState,
  PersonInterface,
  UserActions,
  UserQueries
} from '@campus/dal';
import {
  EnvironmentLogoutInterface,
  ENVIRONMENT_LOGOUT_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogoutViewModel {
  private currentNullUser: Observable<PersonInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_LOGOUT_TOKEN)
    public environmentLogout: EnvironmentLogoutInterface,
    @Inject(WINDOW) private window: Window
  ) {}

  logout(): void {
    this.store.dispatch(new UserActions.RemoveUser());
    this.currentNullUser = this.store.pipe(
      select(UserQueries.getCurrentUser),
      filter(currentUser => !currentUser),
      take(1)
    );
    this.currentNullUser.subscribe(() =>
      this.window.location.assign(this.environmentLogout.url)
    );
  }
}
