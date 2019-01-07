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

  hasPermission(permission: string | string[]): Observable<boolean> {
    if (typeof permission === 'string') {
      permission = [permission];
    }
    return this.store.pipe(
      select(UserQueries.getPermissions),
      map(permissions => permissions.some(p => permission.includes(p)))
    );
  }
}
