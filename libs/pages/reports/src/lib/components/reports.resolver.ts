import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  LearningAreaActions,
  LearningAreaQueries,
  ResultActions,
  ResultQueries,
  StateResolver,
  UiActions,
  UiQuery,
  UserActions,
  UserQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ReportsResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new ResultActions.LoadResults({ userId: this.authService.userId }),
      new UiActions.LoadUi(),
      new UserActions.LoadUser({ force: false })
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      ResultQueries.getLoaded,
      UiQuery.getLoaded,
      UserQueries.getLoaded
    ];
  }
}
