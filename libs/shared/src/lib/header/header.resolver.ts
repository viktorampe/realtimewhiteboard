import { Inject, Injectable } from '@angular/core';
import {
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver,
  UiActions
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
      // new AlertActions.LoadAlerts({ userId: this.authService.userId }),
      new UiActions.LoadUi()
      //TODO:
      // new BreadcrumbActions.LoadBreadcrumbs()
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      AlertQueries.getLoaded
      // TODO: BreadcrumbQueries.getLoaded
    ];
  }
}
