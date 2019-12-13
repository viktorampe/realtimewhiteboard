import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver,
  UserActions,
  UserQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class LoginResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    if (!userId) {
      return [];
    }
    return [new UserActions.LoadUser({})];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    const userId = this.authService.userId;
    if (!userId) {
      return [];
    }

    return [UserQueries.getLoaded];
  }
}
