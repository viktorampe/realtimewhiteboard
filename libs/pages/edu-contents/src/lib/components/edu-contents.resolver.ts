import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleQueries,
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
  LearningDomainActions,
  LearningDomainQueries,
  MethodActions,
  MethodQueries,
  SchoolTypeActions,
  SchoolTypeQueries,
  StateResolver,
  TaskActions,
  TaskEduContentActions,
  TaskEduContentQueries,
  TaskQueries,
  UnlockedContentActions,
  UnlockedContentQueries,
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
      new FavoriteActions.LoadFavorites({
        userId: this.authService.userId
      }),
      new MethodActions.LoadMethods({
        userId: this.authService.userId
      }),
      new EduContentProductTypeActions.LoadEduContentProductTypes(),
      new EduNetActions.LoadEduNets(),
      new SchoolTypeActions.LoadSchoolTypes(),
      new YearActions.LoadYears(),
      new BundleActions.LoadBundles({
        userId: this.authService.userId
      }),
      new TaskActions.LoadTasks({
        userId: this.authService.userId
      }),
      new UnlockedContentActions.LoadUnlockedContents({
        userId: this.authService.userId
      }),
      new TaskEduContentActions.LoadTaskEduContents({
        userId: this.authService.userId
      }),
      new LearningDomainActions.LoadLearningDomains()
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
      YearQueries.getLoaded,
      BundleQueries.getLoaded,
      TaskQueries.getLoaded,
      UnlockedContentQueries.getLoaded,
      TaskEduContentQueries.getLoaded,
      LearningDomainQueries.getLoaded
    ];
  }
}
