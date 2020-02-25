import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentBookActions,
  EduContentBookQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMapTo } from 'rxjs/operators';

@Injectable()
export class AllowedBookGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userId = this.authService.userId;

    this.store.dispatch(
      new EduContentBookActions.LoadEduContentBooks({ userId })
    );

    return this.store.pipe(
      select(EduContentBookQueries.getLoaded),
      filter(eduContentBooksLoaded => eduContentBooksLoaded),
      switchMapTo(
        this.store.pipe(
          select(EduContentBookQueries.getById, { id: +route.params.book })
        )
      ),
      map(book => !!book)
    );
  }
}
