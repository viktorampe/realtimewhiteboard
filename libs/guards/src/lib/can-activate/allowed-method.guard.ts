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
  EduContentBookQueries,
  MethodActions,
  MethodQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AllowedMethodGuard implements CanActivate {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(
      new MethodActions.LoadAllowedMethods({ userId: this.authService.userId })
    );
    return this.store.pipe(
      select(MethodQueries.getAllowedMethodsLoaded),
      filter(allowedMethodsLoaded => allowedMethodsLoaded),
      switchMap(() =>
        this.store.pipe(select(MethodQueries.getAllowedMethodIds))
      ),
      tap(methodIds =>
        this.store.dispatch(
          new EduContentBookActions.LoadEduContentBooks({ methodIds })
        )
      ),
      switchMap(() => this.store.pipe(select(EduContentBookQueries.getLoaded))),
      filter(eduContentBooksLoaded => eduContentBooksLoaded),
      switchMap(() =>
        this.store.pipe(
          select(EduContentBookQueries.getById, { id: +route.params.book })
        )
      ),
      switchMap(book => {
        if (!book) return of(false);
        return this.store.pipe(
          select(MethodQueries.isAllowedMethod, { id: book.methodId })
        );
      })
    );
  }
}
