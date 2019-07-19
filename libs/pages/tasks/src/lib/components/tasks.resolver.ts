import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentQueries,
  LearningAreaActions,
  LearningAreaQueries,
  MethodActions,
  MethodQueries,
  StateResolver,
  TaskActions,
  TaskEduContentActions,
  TaskEduContentQueries,
  TaskInstanceActions,
  TaskInstanceQueries,
  TaskQueries
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
      TaskEduContentQueries.getLoaded
    ];
  }
}
