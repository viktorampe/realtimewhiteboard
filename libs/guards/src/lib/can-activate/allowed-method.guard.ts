import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { DalState, EduContentBookQueries, MethodQueries } from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AllowedMethodGuard implements CanActivate {
  constructor(private store: Store<DalState>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.pipe(
      select(EduContentBookQueries.getById, { id: +route.params.book }),
      switchMap(book => {
        if (!book) return of(false);
        return this.store.pipe(
          select(MethodQueries.isAllowedMethod, { id: book.methodId })
        );
      })
    );
  }
}
