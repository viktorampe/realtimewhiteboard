// tslint:disable: member-ordering
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  ClassGroupActions,
  DiaboloPhaseActions,
  EduContentActions,
  EduContentInterface,
  FavoriteActions,
  LearningAreaActions,
  LearningPlanGoalProgressActions,
  TaskActions,
  TaskEduContentActions,
  UnlockedContentActions,
  UnlockedFreePracticeActions,
  UserActions
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
    private router: Router
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
      this.loadStore();
    }
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

    this.store.dispatch(new BundleActions.LoadBundles({ userId }));
    this.store.dispatch(
      new UnlockedContentActions.LoadUnlockedContents({
        userId: this.authService.userId
      })
    );
    this.store.dispatch(new TaskActions.LoadTasks({ userId }));
    this.store.dispatch(
      new TaskEduContentActions.LoadTaskEduContents({
        userId: this.authService.userId
      })
    );
    this.store.dispatch(new EduContentActions.LoadEduContents({ userId }));
    this.store.dispatch(new FavoriteActions.LoadFavorites({ userId }));
    this.store.dispatch(new LearningAreaActions.LoadLearningAreas());
    this.store.dispatch(new DiaboloPhaseActions.LoadDiaboloPhases({ userId }));
    this.store.dispatch(new ClassGroupActions.LoadClassGroups({ userId }));
    this.store.dispatch(
      new UnlockedFreePracticeActions.LoadUnlockedFreePractices({ userId })
    );
    this.store.dispatch(
      new LearningPlanGoalProgressActions.LoadLearningPlanGoalProgresses({
        userId
      })
    );
  }
}
