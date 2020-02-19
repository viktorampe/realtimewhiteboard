import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupActions,
  ClassGroupQueries,
  DalState,
  EduContentActions,
  EduContentBookActions,
  EduContentBookQueries,
  EduContentQueries,
  GroupActions,
  GroupQueries,
  LearningAreaActions,
  LearningAreaQueries,
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
export class KabasTasksResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;

    return [
      new LearningAreaActions.LoadLearningAreas(),
      new TaskActions.LoadTasks({ userId }),
      new GroupActions.LoadGroups({ userId }),
      new ClassGroupActions.LoadClassGroups({ userId }),
      new LinkedPersonActions.LoadLinkedPersons({ userId }),
      TaskClassGroupActions.loadTaskClassGroups(userId),
      TaskGroupActions.loadTaskGroups(userId),
      TaskStudentActions.loadTaskStudents(userId),
      new TaskEduContentActions.LoadTaskEduContents({ userId }),
      new EduContentActions.LoadEduContents({ userId }),
      new YearActions.LoadYears({ userId }),
      new EduContentBookActions.LoadEduContentBooks({ userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      TaskQueries.getLoaded,
      GroupQueries.getLoaded,
      ClassGroupQueries.getLoaded,
      LinkedPersonQueries.getLoaded,
      TaskClassGroupQueries.getLoaded,
      TaskGroupQueries.getLoaded,
      TaskStudentQueries.getLoaded,
      TaskEduContentQueries.getLoaded,
      EduContentQueries.getLoaded,
      YearQueries.getLoaded,
      EduContentBookQueries.getLoaded
    ];
  }
}
