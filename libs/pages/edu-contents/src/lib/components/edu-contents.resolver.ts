import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentProductTypeActions,
  EduContentProductTypeQueries,
  EduContentQueries,
  EduNetActions,
  EduNetQueries,
  FavoriteActions,
  FavoriteQueries,
  LearningAreaActions,
  LearningAreaQueries,
  MethodActions,
  MethodQueries,
  SchoolTypeActions,
  SchoolTypeQueries,
  StateResolver,
  YearActions,
  YearQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class EduContentsResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      new FavoriteActions.LoadFavorites(),
      new MethodActions.LoadMethods(),
      new EduContentProductTypeActions.LoadEduContentProductTypes(),
      new EduNetActions.LoadEduNets(),
      new SchoolTypeActions.LoadSchoolTypes(),
      new YearActions.LoadYears()
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      EduContentQueries.getLoaded,
      FavoriteQueries.getLoaded,
      MethodQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded,
      EduNetQueries.getLoaded,
      SchoolTypeQueries.getLoaded,
      YearQueries.getLoaded
    ];
  }
}
