import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentQueries,
  FavoriteActions,
  FavoriteQueries,
  StateResolver
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HomeResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [
      new FavoriteActions.LoadFavorites({ userId }),
      new EduContentActions.LoadEduContents({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [FavoriteQueries.getLoaded, EduContentQueries.getLoaded];
  }
}
