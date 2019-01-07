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
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionServiceInterface,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!route.data.requiredPermissions) return true;
    const permitted = this.permissionService.hasPermission(
      route.data.requiredPermissions
    );
    if (!permitted) this.router.navigate(['/error/401']);
    return permitted;
  }
}
