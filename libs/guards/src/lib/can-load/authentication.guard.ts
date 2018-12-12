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
  DalState
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
    console.log(
      '%centering authg canActivate',
      'color: orange; font-weight: bold;'
    );
    if (!this.authService.isLoggedIn()) {
      console.log(
        '%cauthguard redirect to login',
        'color: red; font-weight: bold;'
      );
      this.router.navigate(['/login']);
      return false;
    }
    console.log('%cauthguard true', 'color: green; font-weight: bold;');
    return true;
  }
}
