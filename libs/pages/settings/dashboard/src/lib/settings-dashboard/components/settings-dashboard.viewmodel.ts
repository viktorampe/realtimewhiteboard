import { Inject, Injectable } from '@angular/core';
import { DalState, PersonInterface, UserQueries } from '@campus/dal';
import {
  EnvironmentUIInterface,
  ENVIRONMENT_UI_TOKEN,
  NavigationItemServiceInterface,
  NAVIGATION_ITEM_SERVICE_TOKEN
} from '@campus/shared';
import { NavItem } from '@campus/ui';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsDashboardViewModel {
  links$: Observable<NavItem[]>;
  public user$: Observable<PersonInterface>;

  constructor(
    private store: Store<DalState>,
    @Inject(NAVIGATION_ITEM_SERVICE_TOKEN)
    private navigationItemService: NavigationItemServiceInterface,
    @Inject(ENVIRONMENT_UI_TOKEN) public environmentUi: EnvironmentUIInterface
  ) {
    this.initialize();
  }

  private initialize() {
    this.user$ = this.store.pipe(select(UserQueries.getCurrentUser));

    this.links$ = this.store.pipe(
      select(UserQueries.getPermissions),
      map(userPermissions =>
        this.navigationItemService.getNavItemsForTree(
          'settingsNav',
          userPermissions
        )
      )
    );
  }
}
