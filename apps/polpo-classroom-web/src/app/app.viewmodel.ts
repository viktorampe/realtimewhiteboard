import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  CredentialQueries,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteInterface,
  FavoriteQueries,
  getRouterState,
  LearningAreaQueries,
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
import { combineLatest, Observable, Subscription } from 'rxjs';
import {
  filter,
  map,
  skipWhile,
  switchMap,
  switchMapTo,
  withLatestFrom
} from 'rxjs/operators';
import { NavItemService } from './services/nav-item-service';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel implements OnDestroy {
  // intermediate streams
  private sideNavItems$: Observable<NavItem[]>;
  private profileMenuItems$: Observable<DropdownMenuItemInterface[]>;

  // presentation streams
  public sideNavOpen$: Observable<boolean>;
  public navigationItems$: Observable<NavItem[]>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  private subscriptions: Subscription;

  constructor(
    private store: Store<DalState>,
    private navItemService: NavItemService,
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private feedbackService: FeedBackServiceInterface,
    private breakPointObserver: BreakpointObserver
  ) {
    this.initialize();
  }

  // sets sideNav opened state
  public toggleSidebar(open: boolean) {
    this.store.dispatch(new UiActions.ToggleSideNav({ open }));
  }

  // event handler for feedback dismiss
  // used by banner and snackbar
  public onFeedbackDismiss(event: {
    action: Action;
    feedbackId: string;
  }): void {
    const payload: { id: string; userAction?: Action } = {
      id: event.feedbackId
    };
    if (event.action) {
      this.store.dispatch(event.action);
      payload.userAction = event.action;
    }

    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback(payload)
    );
  }

  public onNavItemChanged(navItem: NavItem) {
    this.store.dispatch(new UiActions.UpdateNavItem({ navItem }));
  }

  private initialize() {
    this.setProfileItems();
    this.setNavItems();
    this.setFeedbackFlow();

    this.subscriptions = new Subscription();
  }

  public toggleSidebarOnNavigation() {
    //Hide sidebar on mobile if we navigate or change screensize
    this.subscriptions.add(
      this.store
        .pipe(
          select(getRouterState),
          switchMap(() => {
            return this.breakPointObserver
              .observe([Breakpoints.XSmall, Breakpoints.Small])
              .pipe(map(result => result.matches));
          })
        )
        .subscribe(isMobile => {
          this.toggleSidebar(!isMobile);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
      this.getFavoriteAreas()
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

  private getFavoriteAreas(): Observable<FavoriteInterface[]> {
    return this.store.pipe(
      select(FavoriteQueries.getAll),
      map(favoriteArray =>
        favoriteArray.filter(favorite => favorite.type === 'area')
      ),
      // TODO: Investigate why this causes an infinite loop
      // select(FavoriteQueries.getByType, { type: FavoriteTypesEnum.AREA }),
      withLatestFrom(
        this.store.pipe(select(LearningAreaQueries.getAllEntities))
      ),
      map(([favorites, learningAreas]) =>
        favorites.map(favorite => ({
          ...favorite,
          learningArea: learningAreas[favorite.learningAreaId]
        }))
      )
    );
  }

  private getCredentials(): Observable<PassportUserCredentialInterface[]> {
    return this.store.pipe(
      select(CredentialQueries.getLoaded),
      skipWhile(loaded => !loaded),
      switchMapTo(this.store.pipe(select(CredentialQueries.getAll)))
    );
  }
}
