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
  MethodQueries,
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
import { Action, select, Selector, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KabasTasksResolver extends StateResolver {
  private booksLoaded = false;
  private methodsLoaded = false;

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    let methodIds: number[];
    this.store
      .pipe(select(MethodQueries.getAllowedMethodIds), take(1))
      .subscribe(ids => {
        methodIds = ids;
        this.methodsLoaded = !!methodIds.length;
      }); // methodsIds resolved in app resolver

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
      TaskClassGroupActions.loadTaskClassGroups(this.authService.userId),
      TaskGroupActions.loadTaskGroups(this.authService.userId),
      TaskStudentActions.loadTaskStudents(this.authService.userId),
      new TaskEduContentActions.LoadTaskEduContents({
        userId: this.authService.userId
      }),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      // TODO: remove `force: true`
      // It was added to make sure methods get loaded, even though they are already resolved through the PendingTaskGuard
      // The problem is that PendingTaskGuard does not wait for the appResolver to complete, so it loads for an empty array of methodIds
      new EduContentBookActions.LoadEduContentBooks({
        methodIds,
        force: this.methodsLoaded && !this.booksLoaded
      })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    this.booksLoaded = this.methodsLoaded;

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
      EduContentBookQueries.getLoaded
    ];
  }
}
