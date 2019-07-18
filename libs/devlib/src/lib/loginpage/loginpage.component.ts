import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  EduContentActions,
  EduContentInterface,
  EduContentTocActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  LearningAreaActions,
  TaskActions,
  TaskEduContentActions,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  UnlockedContentActions,
  UserActions
} from '@campus/dal';
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
  }

  loadToc(): void {
    this.store.dispatch(
      new EduContentTocActions.LoadEduContentTocsForBook({ bookId: 1 })
    );
  }
}
