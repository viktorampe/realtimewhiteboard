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
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class BooksResolver extends StateResolver {
  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {
    super(store);
  }

  protected getLoadableActions(): Action[] {
    return [
      new LearningAreaActions.LoadLearningAreas(),
      new UnlockedBoekeGroupActions.LoadUnlockedBoekeGroups({
        userId: this.authService.userId
      }),
      new UnlockedBoekeStudentActions.LoadUnlockedBoekeStudents({
        userId: this.authService.userId
      }),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      new MethodActions.LoadMethods({
        userId: this.authService.userId
      })
    ];
  }
  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      UnlockedBoekeGroupQueries.getLoaded,
      UnlockedBoekeStudentQueries.getLoaded,
      EduContentQueries.getLoaded,
      MethodQueries.getLoaded
    ];
  }
}
