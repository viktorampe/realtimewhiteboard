import { Injectable } from '@angular/core';
import { DalState, UserQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionServiceInterface } from './permission.service.interface';

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements PermissionServiceInterface {
  constructor(private store: Store<DalState>) {}

  /**
   * Checks if all provided permissions are met for the current user
   * To match one permission from multiple permissions, group the list in an array
   *
   * @param requiredPermissions
   * @returns boolean
   *
   * @example
   * <div *hasPermission="[Licenses.VIEW, [Licenses.ADD, Licenses.REVOKE]]">
   * @example
   */
  hasPermission$(
    requiredPermissions: string | (string | string[])[]
  ): Observable<boolean> {
    let permissions: (string | string[])[];

    if (typeof requiredPermissions === 'string') {
      permissions = [requiredPermissions];
    } else {
      permissions = requiredPermissions;
    }
    return this.store.pipe(
      select(UserQueries.getPermissions),
      map(userPermissions => this.hasPermission(permissions, userPermissions))
    );
  }

  hasPermission(
    requiredPermissions: (string | string[])[],
    availablePermissions: string[]
  ): boolean {
    // every permission in the list must match
    return requiredPermissions.every(permission => {
      if (typeof permission === 'string') {
        return availablePermissions.includes(permission);
      }
      // if permission is an array, at least one must match
      return permission.some(p => availablePermissions.includes(p));
    });
  }
}
