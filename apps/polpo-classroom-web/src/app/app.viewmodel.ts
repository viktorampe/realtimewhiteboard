import { Inject, Injectable } from '@angular/core';
import {
  CredentialQueries,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteInterface,
  FavoriteTypesEnum,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonInterface,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '@campus/shared';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, skipWhile, switchMap, switchMapTo } from 'rxjs/operators';
import { NavItemService } from './services/nav-item-service';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel {
  // intermediate streams
  private sideNavItems$: Observable<NavItem[]>;
  private profileMenuItems$: Observable<DropdownMenuItemInterface[]>;

  // presentation streams
  public sideNavOpen$: Observable<boolean>;
  public navigationItems$: Observable<NavItem[]>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  constructor(
    private store: Store<DalState>,
    private navItemService: NavItemService,
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private feedbackService: FeedBackServiceInterface
  ) {
    this.initialize();
  }

  // sets sideNav opened state
  public toggleSidebar(open: boolean) {
    this.store.dispatch(new UiActions.ToggleSideNav({ open }));
  }

  private setIntermediateStreams() {
    this.sideNavItems$ = combineLatest(
      this.getCurrentUser(),
      this.getFavorites()
    ).pipe(
      filter(([user, favorites]) => !!user),
      map(([user, favorites]) =>
        this.navItemService.getSideNavItems(user, favorites)
      )
    );
  }
  // event handler for feedback dismiss
  // used by banner and snackbar
  public onFeedbackDismiss(event: {
    action: Action;
    feedbackId: string;
  }): void {
    if (event.action) this.store.dispatch(event.action);

    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({ id: event.feedbackId })
    );
  }

  public onNavItemChanged(navItem: NavItem) {
    this.store.dispatch(new UiActions.UpdateNavItem({ navItem }));
  }

  private initialize() {
    this.setProfileItems();
    this.setNavItems();
    this.setFeedbackFlow();
  }

  private setProfileItems() {
    // send data to service -> get array of profileMenuItems
    this.profileMenuItems$ = combineLatest(
      this.getCurrentUser(),
      this.getCredentials()
    ).pipe(
      map(([user, credentials]) =>
        this.navItemService.getProfileMenuItems(user, credentials)
      )
    );

    // send array of profileMenuItems to the store
    // note: not directly used in appComponent
    this.profileMenuItems$.subscribe(menuItems =>
      this.store.dispatch(new UiActions.SetProfileMenuItems({ menuItems }))
    );
  }

  private setNavItems() {
    // send data to service -> get array of navItems
    this.sideNavItems$ = combineLatest(
      this.getCurrentUser(),
      this.getFavorites()
    ).pipe(
      map(([user, favorites]) =>
        this.navItemService.getSideNavItems(user, favorites)
      )
    );

    // send array of navItems to the store
    this.sideNavItems$.subscribe(navItems =>
      this.store.dispatch(new UiActions.SetSideNavItems({ navItems }))
    );

    // read array of navItems from the store
    // note: navItems may be used in other components
    this.navigationItems$ = this.store.pipe(select(UiQuery.getSideNavItems));

    // get sideNav opened state
    this.sideNavOpen$ = this.store.pipe(select(UiQuery.getSideNavOpen));
  }

  private setFeedbackFlow() {
    // success feedback goes to the feedbackService -> snackbar
    this.store
      .select(EffectFeedbackQueries.getNextSuccess)
      .pipe(
        map(feedback => this.feedbackService.openSnackbar(feedback)),
        filter(snackbar => !!snackbar),
        switchMap(snackbarInfo =>
          this.feedbackService.snackbarAfterDismiss(snackbarInfo)
        ),
        map(event => ({
          action: event.actionToDispatch,
          feedbackId: event.feedback.id
        }))
      )
      .subscribe(evt => this.onFeedbackDismiss(evt));

    // error feedback goes into a stream -> bannerComponent
    this.bannerFeedback$ = this.store
      .select(EffectFeedbackQueries.getNextError)
      .pipe(map(this.feedbackService.addDefaultCancelButton));
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
        type: FavoriteTypesEnum.AREA, // TODO in selector: filter on type:'area'
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
