import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver,
  UiActions,
  UiQuery,
  UserActions
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HeaderResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [
      //TODO add load actions
      new UserActions.LoadUser({ force: false }),
      new AlertActions.LoadAlerts({ userId: this.authService.userId }),
      new UiActions.LoadUi()
      //TODO:
      // new BreadcrumbActions.LoadBreadcrumbs()
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      //TODO add resolvable boolean selectors
      AlertQueries.getLoaded,
      UiQuery.getLoaded
      // TODO: BreadcrumbQueries.getLoaded
    ];
  }
}
