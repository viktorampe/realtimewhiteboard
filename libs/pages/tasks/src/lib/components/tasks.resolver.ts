import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  EduContentActions,
  EduContentQueries,
  LearningAreaActions,
  LearningAreaQueries,
  StateResolver,
  TaskActions,
  TaskQueries,
  UserActions,
  UserQueries
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
      new UserActions.LoadUser({ force: false }),
      new LearningAreaActions.LoadLearningAreas(),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      new TaskActions.LoadTasks({ userId: this.authService.userId })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      UserQueries.getLoaded, //todo move to guard
      LearningAreaQueries.getLoaded,
      EduContentQueries.getLoaded,
      TaskQueries.getLoaded
    ];
  }
}
