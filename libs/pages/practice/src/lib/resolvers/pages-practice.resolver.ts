import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeQueries
} from '@campus/dal';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PracticeResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [
      new UnlockedFreePracticeActions.LoadUnlockedFreePractices({ userId })
    ];
  }

  protected getResolvedQueries() {
    return [UnlockedFreePracticeQueries.getLoaded];
  }
}
