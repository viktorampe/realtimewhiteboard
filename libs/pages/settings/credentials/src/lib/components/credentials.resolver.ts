import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  CredentialActions,
  CredentialQueries,
  DalState,
  StateResolver
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class CredentialsResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [
      new CredentialActions.LoadCredentials({ userId: this.authService.userId })
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [CredentialQueries.getLoaded];
  }
}
