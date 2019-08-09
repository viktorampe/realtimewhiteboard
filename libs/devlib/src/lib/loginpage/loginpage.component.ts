// tslint:disable: member-ordering
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  ClassGroupActions,
  DiaboloPhaseActions,
  DiaboloPhaseFixture,
  EduContentActions,
  EduContentInterface,
  EduContentTocActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  LearningAreaActions,
  LearningPlanGoalProgressActions,
  LearningPlanGoalProgressQueries,
  TaskActions,
  TaskEduContentActions,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  UnlockedContentActions,
  UserActions
} from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '@campus/search';
import { ContentEditableComponent } from '@campus/ui';
import { select, Store } from '@ngrx/store';
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

  @ViewChild(ContentEditableComponent)
  contentEditable: ContentEditableComponent;

  private myFavorite: FavoriteInterface = {
    type: FavoriteTypesEnum.EDUCONTENT,
    created: new Date(),
    eduContentId: 1
  };

  alert$ = this.store.pipe(
    select(AlertQueries.getAll),
    map(alerts => alerts[0])
  );

  effectFeedback$: Observable<EffectFeedbackInterface> = this.store.pipe(
    select(EffectFeedbackQueries.getNext)
  );

  date: Date = new Date('2019-01-22');

  constructor(
    public loginPageviewModel: LoginPageViewModel,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<AlertReducer.State>,
    private router: Router,
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface
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
      new LearningPlanGoalProgressActions.LoadLearningPlanGoalProgresses({
        userId
      })
    );
  }

  loadToc(): void {
    this.store.dispatch(
      new EduContentTocActions.LoadEduContentTocsForBook({ bookId: 1 })
    );
  }

  // tslint:disable-next-line: member-ordering
  public filterCriteria = new SearchFilterCriteriaFixture(
    { displayProperty: 'icon' },
    [
      new SearchFilterCriteriaValuesFixture({
        data: new DiaboloPhaseFixture({
          id: 1,
          name: 'opt1',
          icon: 'diabolo-intro'
        }),
        prediction: 0,
        selected: true
      }),
      new SearchFilterCriteriaValuesFixture({
        data: new DiaboloPhaseFixture({
          id: 2,
          name: 'opt2',
          icon: 'diabolo-midden'
        }),
        prediction: 1,
        selected: true
      }),
      new SearchFilterCriteriaValuesFixture({
        data: new DiaboloPhaseFixture({
          id: 3,
          name: 'opt3',
          icon: 'diabolo-outro'
        })
      })
    ]
  );

  public filterSelectionChanged(event) {
    console.log(event);
  }

  public toggleLearningPlanGoalProgress() {
    const userId = this.authService.userId;
    const classGroupId = 1;
    const eduContentTOCId = 1;
    const learningPlanGoalId = 1;
    const userLessonId = 1;

    this.store.dispatch(
      new LearningPlanGoalProgressActions.ToggleLearningPlanGoalProgress({
        personId: userId,
        classGroupId,
        userLessonId,
        learningPlanGoalId
      })
    );

    this.response = this.store.pipe(
      select(LearningPlanGoalProgressQueries.findMany, {
        classGroupId,
        userLessonId
      })
    );
  }

  public createBulk() {
    const userId = this.authService.userId;
    const classGroupId = 1;
    const eduContentTOCId = 1;
    const learningPlanGoalIds = [1, 2, 3];
    const userLessonId = 1;

    this.store.dispatch(
      new LearningPlanGoalProgressActions.BulkAddLearningPlanGoalProgresses({
        personId: userId,
        classGroupId,
        userLessonId,
        learningPlanGoalIds
      })
    );

    this.response = this.store.pipe(
      select(LearningPlanGoalProgressQueries.findMany, {
        classGroupId,
        userLessonId
      })
    );
  }
}
