import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupActions,
  ClassGroupQueries,
  DalState,
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
  TaskStudentQueries
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
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new TaskActions.LoadTasks({ userId: this.authService.userId }),
      new GroupActions.LoadGroups({
        userId: this.authService.userId
      }),
      new ClassGroupActions.LoadClassGroups({
        userId: this.authService.userId
      }),
      new LinkedPersonActions.LoadLinkedPersons({
        userId: this.authService.userId
      }),
      TaskClassGroupActions.loadTaskClassGroups({
        userId: this.authService.userId
      }),
      new TaskGroupActions.LoadTaskGroups({
        userId: this.authService.userId
      }),
      new TaskStudentActions.LoadTaskStudents({
        userId: this.authService.userId
      }),
      new TaskEduContentActions.LoadTaskEduContents({
        userId: this.authService.userId
      })
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
      TaskEduContentQueries.getLoaded
    ];
  }
}
