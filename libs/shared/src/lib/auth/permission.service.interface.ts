import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const PERMISSION_SERVICE_TOKEN = new InjectionToken('PermissionService');

export interface PermissionServiceInterface {
  hasPermission$(
    requiredPermissions: string | (string | string[])[]
  ): Observable<boolean>;
  hasPermission(
    requiredPermissions: string | (string | string[])[],
    availablePermissions: string[]
  ): boolean;
}
