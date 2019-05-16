// tslint:disable:member-ordering
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleActions,
  EduContent,
  EduContentActions,
  EduContentInterface,
  EduContentQueries,
  EffectFeedback,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteServiceInterface,
  FavoriteTypesEnum,
  FAVORITE_SERVICE_TOKEN,
  LearningAreaActions,
  TaskActions,
  TaskEduContentActions,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  UnlockedContentActions,
  UserActions
} from '@campus/dal';
import {
  EduContentCollectionManagerService,
  EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
  QuickLinkComponent,
  QuickLinkTypeEnum
} from '@campus/shared';
import { ContentEditableComponent } from '@campus/ui';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
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
    private personApi: PersonApi,
    @Inject(FAVORITE_SERVICE_TOKEN)
    private favoriteService: FavoriteServiceInterface,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private store: Store<AlertReducer.State>,
    private router: Router,
    @Inject(TOC_SERVICE_TOKEN) private tocService: TocServiceInterface,
    private dialog: MatDialog,
    @Inject(EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN)
    private eduContentCollectionManagerService: EduContentCollectionManagerService
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

  addErrorFeedback(): void {
    const mockAction = new FavoriteActions.UpdateFavorite({
      userId: this.authService.userId,
      favorite: { id: 1, changes: { name: 'foo' } },
      customFeedbackHandlers: {
        useCustomErrorHandler: true
      }
    });
    const mockFeedBack = EffectFeedback.generateErrorFeedback(
      'foo',
      mockAction,
      'Het is niet gelukt de favoriet te wijzigen.'
    );
    mockFeedBack.icon = 'warning';

    this.store.dispatch(
      new EffectFeedbackActions.AddEffectFeedback({
        effectFeedback: mockFeedBack
      })
    );
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrent();
    if (this.currentUser) this.loadCurrentUserinState();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new UserActions.LoadUser({ force: true }));
  }

  openDialog() {
    this.store
      .pipe(
        select(EduContentQueries.getAll),
        take(1)
      )
      .subscribe(entities => {
        const content = Object.assign(new EduContent(), entities[0]);
        this.eduContentCollectionManagerService.manageBundlesForContent(
          content,
          19
        );
      });
  }

  toggleEditable() {
    this.contentEditable.active = !this.contentEditable.active;
  }

  textChanged(text: string) {
    console.log('ContentEditable was changed, new text: ' + text);
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

  updateFavorite() {
    let favorite: FavoriteInterface;
    this.store.pipe(select(FavoriteQueries.getAll)).subscribe(favorites => {
      favorite = favorites[0];
    });
    console.log(favorite);
    this.response = this.favoriteService.updateFavorite(
      this.authService.userId,
      favorite.id,
      {
        name: favorite.name + 'x'
      }
    );
  }

  openQuickLinkManager(): void {
    this.dialog.open(QuickLinkComponent, {
      data: { mode: QuickLinkTypeEnum.FAVORITES },
      autoFocus: true,
      panelClass: 'quick-link__dialog'
    });
  }
}
