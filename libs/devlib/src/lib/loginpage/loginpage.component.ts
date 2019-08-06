// tslint:disable: member-ordering
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  ClassGroupFixture,
  ClassGroupInterface,
  DiaboloPhaseActions,
  DiaboloPhaseFixture,
  EduContentActions,
  EduContentInterface,
  EduContentTocActions,
  EduContentTOCFixture,
  EduContentTOCInterface,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  LearningAreaActions,
  LearningPlanGoalFixture,
  LearningPlanGoalInterface,
  TaskActions,
  TaskEduContentActions,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  UnlockedContentActions,
  UserActions,
  UserLessonFixture,
  UserLessonServiceInterface,
  USER_LESSON_SERVICE_TOKEN
} from '@campus/dal';
import {
  SearchFilterCriteriaFixture,
  SearchFilterCriteriaValuesFixture
} from '@campus/search';
import { ContentEditableComponent } from '@campus/ui';
import { select, Store } from '@ngrx/store';
// tslint:disable-next-line: nx-enforce-module-boundaries
import {
  ItemColumnInterface,
  ItemInterface,
  RowHeaderColumnInterface,
  SubLevelInterface
} from 'libs/ui/src/lib/multi-check-box-table/multi-check-box-table.interface';
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
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface,
    @Inject(USER_LESSON_SERVICE_TOKEN)
    private userLessonService: UserLessonServiceInterface
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

  public createUserLesson() {
    const userId = this.authService.userId;
    const userLesson = new UserLessonFixture({
      id: undefined,
      description: 'dit is een nieuwe userLesson',
      personId: userId
    });
    this.response = this.userLessonService.createForUser(userId, userLesson);
  }

  public subLevels: SubLevelInterface<
    EduContentTOCInterface,
    LearningPlanGoalInterface
  >[] = [
    {
      item: new EduContentTOCFixture({ id: 1, title: 'les1' }),
      label: 'title',
      children: [
        {
          header: new LearningPlanGoalFixture({ id: 1, goal: 'item1' }),
          content: { 1: true }
        },
        {
          header: new LearningPlanGoalFixture({ id: 2, goal: 'item2' }),
          content: { 2: true }
        },
        {
          header: new LearningPlanGoalFixture({ id: 3, goal: 'item3' }),
          content: { 1: true, 2: true }
        }
      ]
    },
    {
      item: new EduContentTOCFixture({ id: 2, title: 'les2' }),
      label: 'title',
      children: [
        {
          header: new LearningPlanGoalFixture({ id: 4, goal: 'item4' }),
          content: {}
        },
        {
          header: new LearningPlanGoalFixture({ id: 5, goal: 'item5' }),
          content: {}
        },
        {
          header: new LearningPlanGoalFixture({ id: 6, goal: 'item6' }),
          content: {}
        }
      ]
    }
  ];

  public itemColumns: ItemColumnInterface<ClassGroupInterface>[] = [
    {
      item: new ClassGroupFixture({ id: 1, name: 'klas1' }),
      key: 'id',
      label: 'name'
    },
    {
      item: new ClassGroupFixture({ id: 2, name: 'klas2' }),
      key: 'id',
      label: 'name'
    }
  ];

  public rowHeaderColumns: RowHeaderColumnInterface<
    LearningPlanGoalInterface
  >[] = [
    { caption: 'id', key: 'id' },
    { caption: 'beschrijving', key: 'goal' }
  ];

  public items: ItemInterface<LearningPlanGoalInterface>[] = [
    {
      header: new LearningPlanGoalFixture({ id: 1, goal: 'item1' }),
      content: { 1: true }
    },
    {
      header: new LearningPlanGoalFixture({ id: 2, goal: 'item2' }),
      content: { 2: true }
    },
    {
      header: new LearningPlanGoalFixture({
        id: 3,
        goal:
          'item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 item3 '
      }),
      content: { 1: true, 2: true }
    }
  ];
}
