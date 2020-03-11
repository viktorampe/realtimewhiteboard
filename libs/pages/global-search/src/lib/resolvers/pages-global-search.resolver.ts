import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupActions,
  ClassGroupQueries,
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseQueries,
  EduContentProductTypeActions,
  EduContentProductTypeQueries,
  FavoriteActions,
  FavoriteQueries,
  GroupActions,
  GroupQueries,
  LearningAreaActions,
  LearningAreaQueries,
  LearningDomainActions,
  LearningDomainQueries,
  LinkedPersonActions,
  LinkedPersonQueries,
  StateResolver,
  TaskActions,
  TaskClassGroupActions,
  TaskClassGroupQueries,
  TaskEduContentActions,
  TaskEduContentQueries,
  TaskGroupActions,
  TaskGroupQueries,
  TaskQueries,
  TaskStudentActions,
  TaskStudentQueries,
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
      new EduContentProductTypeActions.LoadEduContentProductTypes({ userId }),
      new TaskActions.LoadTasks({ userId }),
      new LearningAreaActions.LoadLearningAreas(),
      new TaskEduContentActions.LoadTaskEduContents({ userId }),
      new GroupActions.LoadGroups({ userId }),
      new ClassGroupActions.LoadClassGroups({ userId }),
      new LinkedPersonActions.LoadLinkedPersons({ userId }),
      TaskClassGroupActions.loadTaskClassGroups(userId),
      TaskGroupActions.loadTaskGroups(userId),
      TaskStudentActions.loadTaskStudents(userId),
      new FavoriteActions.LoadFavorites({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      YearQueries.getLoaded,
      LearningDomainQueries.getLoaded,
      DiaboloPhaseQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded,
      TaskQueries.getLoaded,
      LearningAreaQueries.getLoaded,
      TaskEduContentQueries.getLoaded,
      GroupQueries.getLoaded,
      ClassGroupQueries.getLoaded,
      LinkedPersonQueries.getLoaded,
      TaskClassGroupQueries.getLoaded,
      TaskGroupQueries.getLoaded,
      TaskStudentQueries.getLoaded,
      FavoriteQueries.getLoaded
    ];
  }
}
