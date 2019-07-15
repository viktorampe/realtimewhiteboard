import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { DalState, getRouterState, UiActions, UiQuery } from '@campus/dal';
import { NavItem } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
    { title: 'Differentiëren', link: 'error/405' }
  ];

  // presentation streams
  public sideNavOpen$: Observable<boolean>;
  public navigationItems$: Observable<NavItem[]>;

  private subscriptions: Subscription;

  constructor(
    private store: Store<DalState>,
    private breakPointObserver: BreakpointObserver
  ) {
    this.initialize();
  }

  private initialize() {
    this.setNavItems();
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
}
