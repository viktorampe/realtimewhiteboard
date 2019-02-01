import { Inject, Injectable } from '@angular/core';
import {
  CredentialQueries,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteInterface,
  FeedbackService,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonInterface,
  SNACKBAR_SERVICE_TOKEN,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { Action, select, Store } from '@ngrx/store';
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
  private successFeedback$: Observable<EffectFeedbackInterface>;
  private errorFeedback$: Observable<EffectFeedbackInterface>;

  // presentation stream
  public sideNavOpen$: Observable<boolean>;
  public navigationItems$: Observable<NavItem[]>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  constructor(
    private store: Store<DalState>,
    private navItemService: NavItemService,
    @Inject(SNACKBAR_SERVICE_TOKEN) private feedbackService: FeedbackService
  ) {
    this.initialize();
  }

  public onBannerDismiss(event: { action: Action; feedbackId: string }): void {
    if (event.action) this.store.dispatch(event.action);

    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({ id: event.feedbackId })
    );
  }

  private initialize() {
    this.setSourceStreams();
    this.setIntermediateStreams();
    this.setPresentationStreams();
    this.subscribeToStreams();
  }

  toggleSidebar(open: boolean) {
    this.store.dispatch(new UiActions.ToggleSideNav({ open }));
  }

  private setSourceStreams() {
    this.successFeedback$ = this.store.select(
      EffectFeedbackQueries.getNextSuccess
    );

    this.errorFeedback$ = this.store.select(EffectFeedbackQueries.getNextError);
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

    this.feedbackService.setupStreams(this.successFeedback$);
    this.feedbackService.snackbarAfterDismiss$.subscribe(
      (event: {
        dismissedWithAction: boolean;
        feedback: EffectFeedbackInterface;
      }) => {
        let action: Action;
        if (event.dismissedWithAction) {
          action = event.feedback.userActions[0].userAction; // a snackbar has max 1 action
        }

        this.onBannerDismiss({ action, feedbackId: event.feedback.id });
      }
    );
  }

  private setPresentationStreams() {
    this.navigationItems$ = this.store.pipe(select(UiQuery.getSideNavItems));
    this.sideNavOpen$ = this.store.pipe(select(UiQuery.getSideNavOpen));

    this.bannerFeedback$ = this.errorFeedback$.pipe(
      // adds default cancel button, if needed
      map(feedback => {
        if (!feedback) return;

        const feedbackToDisplay = { ...feedback };
        if (feedbackToDisplay.useDefaultCancel) {
          feedbackToDisplay.userActions = [
            ...feedbackToDisplay.userActions,
            {
              title: 'annuleren',
              userAction: null
            }
          ];
        }
        return feedbackToDisplay;
      })
    );
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
