import { Inject, Injectable } from '@angular/core';
import {
  CredentialQueries,
  DalState,
  FavoriteInterface,
  FeedbackServiceInterface,
  FEEDBACK_SERVICE_TOKEN,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonInterface,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, skipWhile, switchMapTo } from 'rxjs/operators';
import { NavItemService } from './services/nav-item-service';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel {
  // intermediate streams
  private sideNavItems$: Observable<NavItem[]>;
  private profileMenuItems$: Observable<DropdownMenuItemInterface[]>;

  // presentation stream
  public sideNavOpen$: Observable<boolean>;
  public navigationItems$: Observable<NavItem[]>;

  constructor(
    private store: Store<DalState>,
    private navItemService: NavItemService,
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private snackBarService: FeedbackServiceInterface
  ) {
    this.initialize();
  }

  initialize() {
    this.setIntermediateStreams();
    this.setPresentationStreams();
    this.subscribeToStreams();
  }

  toggleSidebar(open: boolean) {
    this.store.dispatch(new UiActions.ToggleSideNav({ open }));
  }

  private setIntermediateStreams() {
    this.sideNavItems$ = combineLatest(
      this.getCurrentUser(),
      this.getFavorites()
    ).pipe(
      map(([user, favorites]) =>
        this.navItemService.getSideNavItems(user, favorites)
      )
    );

    this.profileMenuItems$ = combineLatest(
      this.getCurrentUser(),
      this.getCredentials()
    ).pipe(
      map(([user, credentials]) =>
        this.navItemService.getProfileMenuItems(user, credentials)
      )
    );
  }

  private subscribeToStreams() {
    this.sideNavItems$.subscribe(navItems =>
      this.store.dispatch(new UiActions.SetSideNavItems({ navItems }))
    );

    this.profileMenuItems$.subscribe(menuItems =>
      this.store.dispatch(new UiActions.SetProfileMenuItems({ menuItems }))
    );
  }

  private setPresentationStreams() {
    this.navigationItems$ = this.store.pipe(select(UiQuery.getSideNavItems));
    this.sideNavOpen$ = this.store.pipe(select(UiQuery.getSideNavOpen));
  }

  private getCurrentUser(): Observable<PersonInterface> {
    return this.store.pipe(
      select(UserQueries.getCurrentUser),
      skipWhile(currentUser => currentUser === null)
    );
  }

  // TODO Service/State needed
  private getFavorites(): Observable<FavoriteInterface[]> {
    return of([
      {
        type: 'area', // TODO in selector: filter on type:'area'
        learningAreaId: 1,
        learningArea: new LearningAreaFixture({ icon: 'wiskunde' }),
        created: new Date(2018, 11 - 1, 30)
      }
    ]);
  }

  private getCredentials(): Observable<PassportUserCredentialInterface[]> {
    return this.store.pipe(
      select(CredentialQueries.getLoaded),
      skipWhile(loaded => !loaded),
      switchMapTo(this.store.pipe(select(CredentialQueries.getAll)))
    );
  }
}
