import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import {
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN
} from '@campus/shared';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionServiceInterface
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('youyoy');
    return true;
  }
}
