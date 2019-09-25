import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentBookActions,
  EduContentBookQueries,
  EduContentQueries,
  FavoriteActions,
  FavoriteQueries,
  MethodQueries,
  StateResolver
} from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

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
    let methodIds: number[];
    this.store
      .pipe(
        select(MethodQueries.getAllowedMethodIds),
        take(1)
      )
      .subscribe(ids => (methodIds = ids)); // methodsIds resolved in app resolver

    return [
      new FavoriteActions.LoadFavorites({ userId }),
      new EduContentActions.LoadEduContents({ userId }),
      new EduContentBookActions.LoadEduContentBooks({ methodIds })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      FavoriteQueries.getLoaded,
      EduContentQueries.getLoaded,
      EduContentBookQueries.getLoaded
    ];
  }
}
