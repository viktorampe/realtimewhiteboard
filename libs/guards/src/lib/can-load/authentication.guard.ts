import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { DalState, UserQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class AuthenticationGuard
  implements CanLoad, CanActivate, CanActivateChild {
  constructor(private store: Store<DalState>, private router: Router) {}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      select(UserQueries.getCurrentUser),
      tap(currentUser => {
        console.log('%ctesting the canLoad', 'color: red; font-weight: bold;');
        console.log({ currentUser });
        if (!currentUser) this.router.navigate(['/login']);
      }),
      map(currentUser => (currentUser ? true : false))
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      select(UserQueries.getCurrentUser),
      tap(currentUser => {
        console.log(
          '%ctesting the canActivate',
          'color: orange; font-weight: bold;'
        );
        console.log({ currentUser });
        if (!currentUser) this.router.navigate(['/login']);
      }),
      map(currentUser => (currentUser ? true : false))
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      select(UserQueries.getCurrentUser),
      tap(currentUser => {
        console.log(
          '%ctesting the canActivateChild',
          'color: blue; font-weight: bold;'
        );
        console.log({ currentUser });
        if (!currentUser) this.router.navigate(['/login']);
      }),
      map(currentUser => (currentUser ? true : false))
    );
  }
}
