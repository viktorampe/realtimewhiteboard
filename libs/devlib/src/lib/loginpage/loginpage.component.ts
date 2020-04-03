import { Component, Inject, Injector, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  ClassGroupActions,
  DiaboloPhaseActions,
  EduContentActions,
  EduContentFixture,
  EduContentInterface,
  FavoriteActions,
  HistoryActions,
  LearningAreaActions,
  LearningPlanGoalProgressActions,
  TaskActions,
  TaskEduContentActions,
  TaskQueries,
  UnlockedContentActions,
  UnlockedFreePracticeActions,
  UserActions
} from '@campus/dal';
import {
  EduContentCollectionManagerServiceInterface,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN
} from '@campus/shared';
import { select, Selector, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoginPageViewModel } from './loginpage.viewmodel';

@Component({
  selector: 'campus-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  educontents: Observable<EduContentInterface[]>;
  currentUser: Observable<any>;
  route$: Observable<string[]>;
  response: Observable<any>;

  constructor(
    public loginPageviewModel: LoginPageViewModel,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<AlertReducer.State>,
    private router: Router,
    private injector: Injector //leave this -> easier to inject test bits, without mucking up the constructor
  ) {}

  ngOnInit() {
    this.route$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((ne: NavigationEnd) => ne.urlAfterRedirects.split('/').slice(2)),
      filter(urlParts => urlParts.length > 0),
      map(urlParts => {
        return urlParts.map(part =>
          isNaN(+part) ? part : `Error statusCode: ${part}`
        );
      })
    );

    if (this.currentUser) {
      // this.loadStore();
    }

    this.openModal();
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrent();
    if (this.currentUser) this.loadCurrentUserinState();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new UserActions.LoadUser({ force: true }));
  }

  loadStore() {
    const userId = this.authService.userId;

    const loadActions = [
      BundleActions.LoadBundles,
      UnlockedContentActions.LoadUnlockedContents,
      TaskActions.LoadTasks,
      TaskEduContentActions.LoadTaskEduContents,
      EduContentActions.LoadEduContents,
      FavoriteActions.LoadFavorites,
      LearningAreaActions.LoadLearningAreas,
      DiaboloPhaseActions.LoadDiaboloPhases,
      ClassGroupActions.LoadClassGroups,
      UnlockedFreePracticeActions.LoadUnlockedFreePractices,
      LearningPlanGoalProgressActions.LoadLearningPlanGoalProgresses,
      HistoryActions.LoadHistory
    ];

    loadActions.forEach(action => this.store.dispatch(new action({ userId })));
  }

  private resolve(loadedSelectors: Selector<any, any>[]): Observable<boolean> {
    return combineLatest(
      loadedSelectors.map(selector => this.store.pipe(select(selector)))
    ).pipe(
      map(values => values.length === 0 || values.every(value => !!value)),
      filter(value => !!value)
    );
  }

  private openModal() {
    const eduContentcollectionManagerService = this.injector.get(
      EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN
    ) as EduContentCollectionManagerServiceInterface;

    const eduContent = new EduContentFixture({}, { learningAreaId: 7 });

    this.loadStore();

    this.resolve([TaskQueries.getLoaded]).subscribe(() => {
      eduContentcollectionManagerService.manageTasksForContent(eduContent);
    });
  }
}
