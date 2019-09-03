import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  ClassGroupActions,
  ClassGroupQueries,
  DalState,
  DiaboloPhaseActions,
  DiaboloPhaseQueries,
  EduContentActions,
  EduContentProductTypeActions,
  EduContentProductTypeQueries,
  EduContentQueries,
  EduContentTocActions,
  EduContentTocQueries,
  LearningPlanGoalActions,
  LearningPlanGoalProgressActions,
  LearningPlanGoalProgressQueries,
  LearningPlanGoalQueries,
  QueryWithProps,
  StateResolver,
  UserLessonActions,
  UserLessonQueries
} from '@campus/dal';
import { Action, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MethodBookResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }
  protected getLoadableActions(): Action[] {
    const userId = this.authService.userId;
    return [
      new DiaboloPhaseActions.LoadDiaboloPhases({ userId }),
      new EduContentProductTypeActions.LoadEduContentProductTypes({ userId }),
      new EduContentActions.LoadEduContents({ userId }),
      new EduContentTocActions.LoadEduContentTocsForBook({
        bookId: +this.params.book
      }),
      new LearningPlanGoalActions.LoadLearningPlanGoalsForBook({
        userId,
        bookId: +this.params.book
      }),
      new LearningPlanGoalProgressActions.LoadLearningPlanGoalProgresses({
        userId
      }),
      new ClassGroupActions.LoadClassGroups({
        userId
      }),
      new UserLessonActions.LoadUserLessons({
        userId
      })
    ];
  }

  protected getResolvedQueries() {
    return [
      DiaboloPhaseQueries.getLoaded,
      EduContentProductTypeQueries.getLoaded,
      EduContentQueries.getLoaded,
      new QueryWithProps(EduContentTocQueries.isBookLoaded, {
        bookId: +this.params.book
      }),
      new QueryWithProps(LearningPlanGoalQueries.isBookLoaded, {
        bookId: +this.params.book
      }),
      LearningPlanGoalProgressQueries.getLoaded,
      ClassGroupQueries.getLoaded,
      UserLessonQueries.getLoaded
    ];
  }
}
