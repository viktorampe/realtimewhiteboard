import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { WINDOW } from '@campus/browser';
import { DalState, UserActions, UserQueries } from '@campus/dal';
import {
  EnvironmentTermPrivacyInterface,
  ENVIRONMENT_TERM_PRIVACY_TOKEN
} from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMapTo } from 'rxjs/operators';

@Injectable()
export class TermPrivacyGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    @Inject(ENVIRONMENT_TERM_PRIVACY_TOKEN)
    public environmentTermPrivacy: EnvironmentTermPrivacyInterface,
    @Inject(WINDOW) private window: Window
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new UserActions.LoadUser({}));
    return this.store.pipe(
      select(UserQueries.getLoaded),
      filter(loaded => !!loaded),
      switchMapTo(
        this.store.pipe(
          select(UserQueries.getCurrentUser),
          map(currentUser => {
            if (!currentUser.terms) {
              this.window.location.assign(this.environmentTermPrivacy.url);
              return false;
            }
            return true;
          })
        )
      )
    );
  }
}
