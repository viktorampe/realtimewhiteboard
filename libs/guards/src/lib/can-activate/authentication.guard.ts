import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  UserActions,
  UserQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMapTo, tap } from 'rxjs/operators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); //TODO needs to be updated when actual link is known
      return false;
    }
    this.store.dispatch(new UserActions.LoadUser({ force: false }));
    return this.store.pipe(
      select(UserQueries.getLoaded),
      filter(loaded => !!loaded),
      tap(() =>
        this.store.dispatch(new UserActions.LoadPermissions({ force: false }))
      ),
      switchMapTo(this.store.pipe(select(UserQueries.getPermissionsLoaded))),
      filter(loaded => !!loaded)
    );
  }
}
