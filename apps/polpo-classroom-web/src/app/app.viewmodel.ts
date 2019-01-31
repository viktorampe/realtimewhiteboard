import { Inject, Injectable } from '@angular/core';
import {
  CredentialQueries,
  DalState,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  FavoriteInterface,
  FeedbackService,
  FEEDBACK_SERVICE_TOKEN,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonInterface,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { DropdownMenuItemInterface, NavItem } from '@campus/ui';
import { Action, select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, skipWhile, switchMapTo } from 'rxjs/operators';
import { NavItemService } from './services/nav-item-service';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel {
  // intermediate streams
  private sideNavItems$: Observable<NavItem[]>;
  private profileMenuItems$: Observable<DropdownMenuItemInterface[]>;
  private displayedBannerFeedback$ = new BehaviorSubject<
    EffectFeedbackInterface
  >(null);

  // presentation stream
  public navigationItems$: Observable<NavItem[]>;
  public bannerFeedback$: Observable<EffectFeedbackInterface>;

  constructor(
    private store: Store<DalState>,
    private navItemService: NavItemService,
    @Inject(FEEDBACK_SERVICE_TOKEN) private feedbackService: FeedbackService
  ) {
    this.initialize();
  }

  public onBannerDismiss(event: { action: Action; feedbackId: string }): void {
    this.displayedBannerFeedback$.next(null);

    if (event.action) this.store.dispatch(event.action);

    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({ id: event.feedbackId })
    );
  }

  private initialize() {
    this.setIntermediateStreams();
    this.subscribeToStreams();
    this.setPresentationStreams();
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

    combineLatest(
      this.displayedBannerFeedback$.pipe(filter(value => value === null)),
      this.feedbackService.bannerFeedback$
    ).subscribe(([displayedFeedback, latestFeedBack]) => {
      if (displayedFeedback !== latestFeedBack) {
        this.displayedBannerFeedback$.next(latestFeedBack);
      }
    });
  }

  private setPresentationStreams() {
    this.navigationItems$ = this.store.pipe(select(UiQuery.getSideNavItems));
    this.bannerFeedback$ = this.displayedBannerFeedback$;
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
