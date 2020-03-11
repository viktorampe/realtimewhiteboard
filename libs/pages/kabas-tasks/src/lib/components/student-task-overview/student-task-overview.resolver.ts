import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  DalState,
  LearningAreaActions,
  LearningAreaQueries,
  ResultActions,
  ResultQueries,
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
export class StudentTaskOverviewResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    const { userId } = this.authService;

    return [
      new TaskActions.LoadTasks({ userId }),
      new LearningAreaActions.LoadLearningAreas(),
      new ResultActions.LoadResults({ userId }),
      new TaskEduContentActions.LoadTaskEduContents({ userId }),
      new TaskInstanceActions.LoadTaskInstances({ userId })
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      TaskQueries.getLoaded,
      LearningAreaQueries.getLoaded,
      ResultQueries.getLoaded,
      TaskEduContentQueries.getLoaded,
      TaskInstanceQueries.getLoaded
    ];
  }
}
