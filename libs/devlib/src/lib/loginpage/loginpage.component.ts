// tslint:disable:nx-enforce-module-boundaries
// tslint:disable:member-ordering
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertQueries,
  AlertReducer,
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  EduContentInterface,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteFixture,
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
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrent();
    if (this.currentUser) this.loadCurrentUserinState();
  }

  loadCurrentUserinState() {
    this.store.dispatch(new UserActions.LoadUser({ force: true }));
  }

  getFavorites(userId: number) {
    this.response = this.favoriteService.getAllForUser(userId);
  }

  addFavorite(userId: number) {
    this.response = this.favoriteService.addFavorite(
      userId,
      new FavoriteFixture({ id: null, personId: userId, learningAreaId: 2 })
    );
  }

  removeFavorite(userId: number, favoriteId: number) {
    this.response = this.favoriteService.deleteFavorite(userId, favoriteId);
  }
}
