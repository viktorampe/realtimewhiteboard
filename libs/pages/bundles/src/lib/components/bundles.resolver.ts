import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  BundleQueries,
  ContentStatusActions,
  ContentStatusQueries,
  DalState,
  EduContentActions,
  EduContentQueries,
  LearningAreaActions,
  LearningAreaQueries,
  MethodActions,
  MethodQueries,
  StateResolver,
  StudentContentStatusActions,
  StudentContentStatusQueries,
  UnlockedBoekeGroupActions,
  UnlockedBoekeGroupQueries,
  UnlockedBoekeStudentActions,
  UnlockedBoekeStudentQueries,
  UnlockedContentActions,
  UnlockedContentQueries,
  UserContentActions,
  UserContentQueries
} from '@campus/dal';
import { Action, Selector, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class BundlesResolver extends StateResolver {
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
      new ContentStatusActions.LoadContentStatuses(),
      new StudentContentStatusActions.LoadStudentContentStatuses({
        studentId: this.authService.userId
      }),
      new BundleActions.LoadBundles({ userId: this.authService.userId }),
      new EduContentActions.LoadEduContents({
        userId: this.authService.userId
      }),
      new UserContentActions.LoadUserContents({
        userId: this.authService.userId
      }),
      new UnlockedContentActions.LoadUnlockedContents({
        userId: this.authService.userId
      }),
      new UnlockedBoekeGroupActions.LoadUnlockedBoekeGroups({
        userId: this.authService.userId
      }),
      new UnlockedBoekeStudentActions.LoadUnlockedBoekeStudents({
        userId: this.authService.userId
      })
    ];
  }

  protected getResolvedQueries(): Selector<object, boolean>[] {
    return [
      LearningAreaQueries.getLoaded,
      MethodQueries.getLoaded,
      ContentStatusQueries.getLoaded,
      StudentContentStatusQueries.getLoaded,
      BundleQueries.getLoaded,
      EduContentQueries.getLoaded,
      UserContentQueries.getLoaded,
      UnlockedContentQueries.getLoaded,
      UnlockedBoekeGroupQueries.getLoaded,
      UnlockedBoekeStudentQueries.getLoaded
    ];
  }
}
