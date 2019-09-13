import { Inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN
} from '@campus/shared';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    if (
      !route.data.requiredPermissions ||
      route.data.requiredPermissions.length === 0
    )
      return true;

    return this.permissionService
      .hasPermission$(route.data.requiredPermissions)
      .pipe(
        tap(permitted => {
          if (!permitted) this.router.navigate(['/error/401']);
        })
      );
  }
}
