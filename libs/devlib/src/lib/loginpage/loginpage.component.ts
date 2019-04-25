// tslint:disable:nx-enforce-module-boundaries
// tslint:disable:member-ordering
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  EduContentInterface,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteTypesEnum,
  TocServiceInterface,
  TOC_SERVICE_TOKEN,
  UserActions
} from '@campus/dal';
import { PersonApi } from '@diekeure/polpo-api-angular-sdk';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  FavoriteServiceInterface,
  FAVORITE_SERVICE_TOKEN
} from './../../../../dal/src/lib/favorite/favorite.service.interface';
import { ManageCollectionComponent } from './../../../../ui/src/lib/manage-collection/manage-collection.component';
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
    private dialog: MatDialog
  ) {
    return;
    this.store.dispatch(
      new FavoriteActions.LoadFavorites({ userId: this.authService.userId })
    );
  }

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

    // fill store
    /*this.store.dispatch(new BundleActions.LoadBundles({ userId: 186 }));
    this.store.dispatch(
      new UnlockedContentActions.LoadUnlockedContents({ userId: 186 })
    );
    this.store.dispatch(new TaskActions.LoadTasks({ userId: 186 }));
    this.store.dispatch(
      new TaskEduContentActions.LoadTaskEduContents({ userId: 186 })
    );
    this.store.dispatch(new EduContentActions.LoadEduContents({ userId: 186 }));*/
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrent();
    if (this.currentUser) this.loadCurrentUserinState();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new UserActions.LoadUser({ force: true }));
  }

  openDialog() {
    const dialogRef = this.dialog.open(ManageCollectionComponent, {
      data: this.getDialogData()
    });

    dialogRef.componentInstance.selectionChanged.subscribe(result => {
      console.log('Selection changed:', result);
    });
  }

  private getDialogData() {
    return {
      title: 'Zelda needs some Links',
      item: {
        icon: 'task',
        label: 'Zelda',
        id: 42,
        className: 'itemReceivingLinks'
      },
      linkableItems: [
        {
          icon: 'bundle',
          label: 'Link',
          id: 1,
          className: 'itemToLink'
        },
        {
          icon: 'bundle',
          label: 'Toon Link',
          id: 2,
          className: 'itemToLink'
        },
        {
          icon: 'bundle',
          label: 'Dark Link',
          id: 3,
          className: 'itemToLink'
        }
      ],
      linkedItemIds: new Set([1, 3]),
      recentItemIds: new Set([1])
    };
  }
}
