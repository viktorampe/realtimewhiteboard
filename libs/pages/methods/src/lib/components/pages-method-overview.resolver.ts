import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentQueries,
  MethodActions,
  MethodQueries,
  StateResolver,
  YearActions,
  YearQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MethodsOverviewResolver extends StateResolver {
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
      new MethodActions.LoadAllowedMethods({ userId }),
      new YearActions.LoadYears({ userId }),
      new EduContentActions.LoadEduContents({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      MethodQueries.getLoaded,
      MethodQueries.getAllowedMethodsLoaded,
      YearQueries.getLoaded,
      EduContentQueries.getLoaded
    ];
  }
}
