import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { WINDOW } from '@campus/browser';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  UserActions,
  UserQueries
} from '@campus/dal';
import {
  EnvironmentLoginInterface,
  ENVIRONMENT_LOGIN_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMapTo, tap } from 'rxjs/operators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(ENVIRONMENT_LOGIN_TOKEN)
    public environmentLogin: EnvironmentLoginInterface,
    @Inject(WINDOW) private window: Window
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (route.queryParams.accessToken && route.queryParams.userId) {
      this.authService.loginWithToken(
        route.queryParams.accessToken,
        route.queryParams.userId
      );
    }
    if (!this.authService.isLoggedIn()) {
      this.window.location.assign(this.environmentLogin.url);
      return false;
    }
    this.store.dispatch(new UserActions.LoadUser({}));
    return this.store.pipe(
      select(UserQueries.getLoaded),
      filter(loaded => !!loaded),
      tap(() => this.store.dispatch(new UserActions.LoadPermissions({}))),
      switchMapTo(this.store.pipe(select(UserQueries.getPermissionsLoaded))),
      filter(loaded => !!loaded)
    );
  }
}
