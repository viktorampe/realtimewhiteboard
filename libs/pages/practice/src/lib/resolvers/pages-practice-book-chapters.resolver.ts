import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentTocActions,
  EduContentTocQueries,
  QueryWithProps,
  ResultActions,
  ResultQueries,
  StateResolver
} from '@campus/dal';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PracticeBookChaptersResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [
      new EduContentTocActions.LoadEduContentTocsForBook({
        bookId: +this.params.book
      }),
      new ResultActions.LoadResults({ userId: this.authService.userId })
    ];
  }

  protected getResolvedQueries() {
    return [
      new QueryWithProps(EduContentTocQueries.isBookLoaded, {
        bookId: +this.params.book
      }),
      ResultQueries.getLoaded
    ];
  }
}
