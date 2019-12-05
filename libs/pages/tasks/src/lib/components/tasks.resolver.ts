import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupActions,
  ClassGroupQueries,
  DalState,
  EduContentActions,
  EduContentQueries,
  GroupActions,
  GroupQueries,
  LearningAreaActions,
  LearningAreaQueries,
  LinkedPersonActions,
  LinkedPersonQueries,
  MethodActions,
  MethodQueries,
  StateResolver,
  TaskActions,
  TaskClassGroupActions,
  TaskClassGroupQueries,
  TaskEduContentActions,
  TaskEduContentQueries,
  TaskGroupActions,
  TaskGroupQueries,
  TaskInstanceActions,
  TaskInstanceQueries,
  TaskQueries,
  TaskStudentActions,
  TaskStudentQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TasksResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new MethodActions.LoadMethods({
        userId: this.authService.userId
      }),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      new TaskActions.LoadTasks({ userId: this.authService.userId }),
      new TaskEduContentActions.LoadTaskEduContents({
        userId: this.authService.userId
      }),
      new TaskInstanceActions.LoadTaskInstances({
        userId: this.authService.userId
      }),
      new TaskGroupActions.LoadTaskGroups({
        userId: this.authService.userId
      }),
      new TaskStudentActions.LoadTaskStudents({
        userId: this.authService.userId
      }),
      new TaskClassGroupActions.LoadTaskClassGroups({
        userId: this.authService.userId
      }),
      new GroupActions.LoadGroups({
        userId: this.authService.userId
      }),
      new ClassGroupActions.LoadClassGroups({
        userId: this.authService.userId
      }),
      new LinkedPersonActions.LoadLinkedPersons({
        userId: this.authService.userId
      }),
      new ClassGroupActions.LoadClassGroups({
        userId: this.authService.userId
      })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      MethodQueries.getLoaded,
      EduContentQueries.getLoaded,
      TaskQueries.getLoaded,
      TaskInstanceQueries.getLoaded,
      TaskEduContentQueries.getLoaded,
      TaskGroupQueries.getLoaded,
      TaskStudentQueries.getLoaded,
      ClassGroupQueries.getLoaded,
      LinkedPersonQueries.getLoaded,
      ClassGroupQueries.getLoaded,
      GroupQueries.getLoaded,
      TaskClassGroupQueries.getLoaded
    ];
  }
}
