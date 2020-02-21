import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentBookActions,
  EduContentBookQueries,
  MethodActions,
  MethodQueries,
  StateResolver
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MethodOverviewResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;

    return [
      new MethodActions.LoadMethods({ userId }),
      new EduContentBookActions.LoadEduContentBooks({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [MethodQueries.getLoaded, EduContentBookQueries.getLoaded];
  }
}
