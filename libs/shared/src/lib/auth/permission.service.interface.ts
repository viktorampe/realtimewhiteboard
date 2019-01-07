import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const PERMISSION_SERVICE_TOKEN = new InjectionToken('PermissionService');

export interface PermissionServiceInterface {
  hasPermission(permission: string | string[]): Observable<boolean>;
}
