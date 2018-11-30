import { Injectable } from '@angular/core';
import {
  DalState,
  FavoriteInterface,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonInterface,
  UiActions,
  UiQuery,
  UserQueries
} from '@campus/dal';
import { NavItem } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavItemService } from './services/nav-item-service';

@Injectable({
  providedIn: 'root'
})
export class AppViewModel {
  // intermediate streams
  private sideNavItems$: Observable<NavItem[]>;
  private profileMenuItems$: Observable<NavItem[]>;

  // presentation stream
  public navigationItems$: Observable<NavItem[]>;

  constructor(
    private store: Store<DalState>,
    private navItemService: NavItemService
  ) {
    this.initialize();
  }

  initialize() {
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

    this.profileMenuItems$.subscribe(navItems =>
      this.store.dispatch(new UiActions.SetProfileMenuItems({ navItems }))
    );
  }

  private setPresentationStreams() {
    this.navigationItems$ = this.store.pipe(select(UiQuery.getSideNavItems));
  }

  private getCurrentUser(): Observable<PersonInterface> {
    return this.store.pipe(select(UserQueries.getCurrentUser));
  }

  // TODO Service/State needed
  private getFavorites(): Observable<FavoriteInterface[]> {
    return of([
      {
        type: 'area', // TODO in selector: filter on type:'area'
        learningAreaId: 1,
        learningArea: new LearningAreaFixture({ icon: 'wiskunde' }),
        created: new Date()
      }
    ]);
  }

  // TODO Service/State needed
  private getCredentials(): Observable<PassportUserCredentialInterface[]> {
    return of([
      {
        profile: { platform: 'url-van-smartschoolplatform' },
        provider: 'smartschool'
      }
    ]);
  }
}
