import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  SettingsPermissions
} from '@campus/dal';
import {
  NavigationItemServiceInterface,
  NAVIGATION_ITEM_SERVICE_TOKEN,
  NavItem
} from '@campus/shared';
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
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    @Inject(NAVIGATION_ITEM_SERVICE_TOKEN)
    private navigationItemService: NavigationItemServiceInterface
  ) {
    this.initialize();
  }

  private initialize() {
    this.links$ = this.authService
      .getCurrent()
      .pipe(map(user => this.navigationItemService.getSettingsNavItems(user)));
  }
}
