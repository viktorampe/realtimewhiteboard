import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AlertsResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [new AlertActions.LoadAlerts({ userId: this.authService.userId })];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [AlertQueries.getLoaded];
  }
}
