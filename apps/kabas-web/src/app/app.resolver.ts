import { Inject, Injectable } from '@angular/core';
import {
  AlertActions,
  AlertQueries,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  FavoriteActions,
  FavoriteQueries,
  HistoryActions,
  HistoryQueries,
  LearningAreaActions,
  LearningAreaQueries,
  MethodActions,
  MethodQueries,
  StateResolver,
  UiActions,
  UiQuery
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AppResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [
      new MethodActions.LoadMethods({ userId: this.authService.userId }),
      new MethodActions.LoadAllowedMethods({ userId: this.authService.userId }),
      new AlertActions.LoadAlerts({ userId: this.authService.userId }),
      new LearningAreaActions.LoadLearningAreas(),
      new FavoriteActions.LoadFavorites({ userId: this.authService.userId }),
      new HistoryActions.LoadHistory({ userId: this.authService.userId }),
      new UiActions.LoadUi()
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      MethodQueries.getLoaded,
      MethodQueries.getAllowedMethodsLoaded,
      AlertQueries.getLoaded,
      LearningAreaQueries.getLoaded,
      FavoriteQueries.getLoaded,
      HistoryQueries.getLoaded,
      UiQuery.getLoaded
    ];
  }
}
