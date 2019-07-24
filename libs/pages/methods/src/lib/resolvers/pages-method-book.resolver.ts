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
  StateResolver
} from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      DiaboloPhaseQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded,
      EduContentQueries.getLoaded
    ];
  }

  protected getStoreSelectionsWithProperties(): Observable<boolean>[] {
    return [
      this.store.pipe(
        select(EduContentTocQueries.isBookLoaded, { bookId: this.params.book })
      )
    ];
  }
}
