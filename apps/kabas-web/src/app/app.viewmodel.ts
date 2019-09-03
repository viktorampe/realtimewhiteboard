import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  getRouterState,
  UiActions,
  UiQuery
} from '@campus/dal';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '@campus/shared';
import { NavItem } from '@campus/ui';
import { Action, select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel implements OnDestroy {
  //props
  public navItems: NavItem[] = [
    { title: 'Home', link: 'error/400' },
    { title: 'Methodes', link: 'methods' },
    { title: 'Taken', link: 'error/402' },
    { title: 'Resultaten', link: 'error/403' },
    { title: 'Vrij oefenen', link: 'error/404' },
    { title: 'Differentiëren', link: 'error/405' },
    { title: 'Instellingen', link: 'settings' }
  ];

  // presentation streams
  public sideNavOpen$: Observable<boolean>;
  public navigationItems$: Observable<NavItem[]>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  private subscriptions: Subscription;

  constructor(
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private feedbackService: FeedBackServiceInterface,
    private store: Store<DalState>,
    private breakPointObserver: BreakpointObserver
  ) {
    this.initialize();
  }

  private initialize() {
    this.setNavItems();
    this.setFeedbackFlow();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // sets sideNav opened state
  public toggleSidebar(open: boolean) {
    this.store.dispatch(new UiActions.ToggleSideNav({ open }));
  }

  public onNavItemChanged(navItem: NavItem) {
    this.store.dispatch(new UiActions.UpdateNavItem({ navItem }));
  }

  private setNavItems() {
    this.store.dispatch(
      new UiActions.SetSideNavItems({ navItems: this.navItems })
    );

    // read array of navItems from the store
    this.navigationItems$ = this.store.pipe(select(UiQuery.getSideNavItems));

    // get sideNav opened state
    this.sideNavOpen$ = this.store.pipe(select(UiQuery.getSideNavOpen));
  }

  private setFeedbackFlow() {
    // success feedback goes to the feedbackService -> snackbar
    this.store
      .pipe(
        select(EffectFeedbackQueries.getNextSuccess),
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
    this.bannerFeedback$ = this.store.pipe(
      select(EffectFeedbackQueries.getNextError),
      map(this.feedbackService.addDefaultCancelButton)
    );
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
}
