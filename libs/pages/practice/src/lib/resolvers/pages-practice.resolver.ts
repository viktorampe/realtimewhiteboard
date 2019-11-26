import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  StateResolver,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeQueries,
  YearActions,
  YearQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

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
      new UnlockedFreePracticeActions.LoadUnlockedFreePractices({ userId }),
      new YearActions.LoadYears({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [UnlockedFreePracticeQueries.getLoaded, YearQueries.getLoaded];
  }
}
