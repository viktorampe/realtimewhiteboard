import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupActions,
  ClassGroupQueries,
  DalState,
  EduContentTocActions,
  EduContentTocQueries,
  QueryWithProps,
  StateResolver,
  UnlockedFreePracticeActions,
  UnlockedFreePracticeQueries
} from '@campus/dal';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PracticeMethodDetailResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [
      new EduContentTocActions.LoadEduContentTocsForBook({
        bookId: +this.params.book
      }),
      new ClassGroupActions.LoadClassGroups({
        userId
      }),
      new UnlockedFreePracticeActions.LoadUnlockedFreePractices({
        userId
      })
    ];
  }

  protected getResolvedQueries() {
    return [
      ClassGroupQueries.getLoaded,
      UnlockedFreePracticeQueries.getLoaded,
      new QueryWithProps(EduContentTocQueries.isBookLoaded, {
        bookId: +this.params.book
      })
    ];
  }
}
