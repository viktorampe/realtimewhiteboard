import { Inject, Injectable } from '@angular/core';
import { DalState, SettingsPermissions, UserQueries } from '@campus/dal';
import { NavigationItemServiceInterface, NAVIGATION_ITEM_SERVICE_TOKEN, NavItem } from '@campus/shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Link {
  url: string[];
  name: string;
  icon: string;
  permissions?: SettingsPermissions[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsDashboardViewModel {
  links$: Observable<NavItem[]>;

  constructor(
    private store: Store<DalState>,
    @Inject(NAVIGATION_ITEM_SERVICE_TOKEN)
    private navigationItemService: NavigationItemServiceInterface
  ) {
    this.initialize();
  }

  private initialize() {
    this.links$ = this.store.pipe(
      select(UserQueries.getPermissions),
      map(userPermissions => this.navigationItemService.getSettingsNavItems(userPermissions)));
  }
}
