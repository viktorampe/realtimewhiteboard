import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseQueries,
  EduContentActions,
  EduContentProductTypeActions,
  EduContentProductTypeQueries,
  EduContentQueries,
  EduContentTocActions,
  EduContentTocQueries,
  QueryWithProps,
  StateResolver
} from '@campus/dal';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MethodBookResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [
      new DiaboloPhaseActions.LoadDiaboloPhases({ userId }),
      new EduContentProductTypeActions.LoadEduContentProductTypes({ userId }),
      new EduContentActions.LoadEduContents({ userId }),
      new EduContentTocActions.LoadEduContentTocsForBook({
        bookId: +this.params.book
      })
    ];
  }

  protected getResolvedQueries() {
    return [
      DiaboloPhaseQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded,
      EduContentQueries.getLoaded,
      new QueryWithProps(EduContentTocQueries.isBookLoaded, {
        bookId: +this.params.book
      })
    ];
  }
}
