import { Injectable } from '@angular/core';
import {
  DalState,
  FavoriteInterface,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface,
  UiActions
} from '@campus/dal';
import { NavItem } from '@campus/ui';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppResolver } from './app.resolver';
import { NavItemService } from './services/nav-item-service';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel {
  // source streams
  private currentUser$: Observable<PersonInterface>;
  private favorites$: Observable<FavoriteInterface[]>;
  private credentials$: Observable<PassportUserCredentialInterface[]>;

  // intermediate streams
  public sideNavItems$: Observable<NavItem[]>;
  private profileMenuItems$: Observable<NavItem[]>;

  constructor(
    private store: Store<DalState>,
    private resolver: AppResolver,
    private navItemService: NavItemService
  ) {
    this.initialize();
  }

  initialize() {
    this.resolver.resolve(); //TODO add to routing somehow
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.subscribeToStreams();
  }

  private setSourceStreams() {
    this.currentUser$ = this.getCurrentUser();
    this.favorites$ = this.getFavorites();
    this.credentials$ = this.getCredentials();
  }

  private setIntermediateStreams() {
    this.sideNavItems$ = combineLatest(this.currentUser$, this.favorites$).pipe(
      map(([user, favorites]) =>
        this.navItemService.getSideNavItems(user, favorites)
      )
    );

    this.profileMenuItems$ = combineLatest(
      this.currentUser$,
      this.credentials$
    ).pipe(
      map(([user, credentials]) =>
        this.navItemService.getProfileMenuItems(user, credentials)
      )
    );
  }

  private subscribeToStreams() {
    this.sideNavItems$.subscribe(
      // TODO updateSideNavContent action gebruiken wanneer beschikbaar
      navItems => this.store.dispatch(new UiActions.ToggleSideNav())
    );

    this.profileMenuItems$.subscribe(
      // TODO updateProfileMenuContent action gebruiken wanneer beschikbaar
      navItems => this.store.dispatch(new UiActions.ToggleSideNav())
    );
  }

  private getCurrentUser(): Observable<PersonInterface> {
    return of(new PersonFixture());
    // TODO echte waarde currentUser gebruiken
    //return this.store.pipe(select(UserQueries.getCurrentUser, {}));
  }

  // TODO Service/State needed
  private getFavorites(): Observable<FavoriteInterface[]> {
    return of([
      {
        type: '',
        learningAreaId: 1,
        learningArea: new LearningAreaFixture({ icon: 'wiskunde' }),
        created: new Date()
      }
    ]);
  }

  // TODO Service/State needed
  private getCredentials(): Observable<PassportUserCredentialInterface[]> {
    return of([{ profile: {}, provider: 'smartschool' }]);
  }
}
