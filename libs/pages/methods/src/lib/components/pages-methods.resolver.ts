import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseQueries,
  EduContentBookActions,
  EduContentBookQueries,
  EduContentProductTypeActions,
  EduContentProductTypeQueries,
  MethodQueries,
  StateResolver
} from '@campus/dal';
import { Action, select, Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MethodsResolver extends StateResolver {
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
      .subscribe(ids => (methodIds = ids)); // methodsIds resolved in parent resolver
    return [
      new DiaboloPhaseActions.LoadDiaboloPhases({ userId }),
      new EduContentProductTypeActions.LoadEduContentProductTypes({ userId }),
      new EduContentBookActions.LoadEduContentBooks({ methodIds })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      DiaboloPhaseQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded,
      EduContentBookQueries.getLoaded
    ];
  }
}
