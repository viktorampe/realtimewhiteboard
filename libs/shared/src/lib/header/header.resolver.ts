import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  CredentialActions,
  CredentialQueries,
  DalState,
  StateResolver,
  UiActions,
  UiQuery
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

export const HEADER_RESOLVER_TOKEN = new InjectionToken('HeaderResolver');

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
      new CredentialActions.LoadCredentials({
        userId: this.authService.userId
      }),
      new AlertActions.LoadAlerts({ userId: this.authService.userId }),
      new UiActions.LoadUi()
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      CredentialQueries.getLoaded,
      AlertQueries.getLoaded,
      UiQuery.getLoaded
    ];
  }
}
