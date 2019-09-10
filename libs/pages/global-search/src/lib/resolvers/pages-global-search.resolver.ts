import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseQueries,
  EduContentProductTypeActions,
  EduContentProductTypeQueries,
  LearningDomainActions,
  LearningDomainQueries,
  StateResolver,
  YearActions,
  YearQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [
      new YearActions.LoadYears({ userId }),
      new LearningDomainActions.LoadLearningDomains(),
      new DiaboloPhaseActions.LoadDiaboloPhases({ userId }),
      new EduContentProductTypeActions.LoadEduContentProductTypes({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      YearQueries.getLoaded,
      LearningDomainQueries.getLoaded,
      DiaboloPhaseQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded
    ];
  }
}
