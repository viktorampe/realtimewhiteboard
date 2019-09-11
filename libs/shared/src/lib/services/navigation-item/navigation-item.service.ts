import { Inject, Injectable, InjectionToken } from '@angular/core';
import { PersonInterface, RoleInterface } from '@campus/dal';

export const APP_NAVIGATION_TREE_TOKEN = new InjectionToken<NavItem[]>(
  'AppNavigationTreeToken'
);

export const NAVIGATION_ITEM_SERVICE_TOKEN = new InjectionToken<
  NavigationItemService
>('NavigationItemService');

export interface NavigationItemServiceInterface {
  getSideNavItems(user: PersonInterface): NavItem[];
  getSettingsNavItems(user: PersonInterface): NavItem[];
  getProfileMenuNavItems(user: PersonInterface): NavItem[];
}

export interface NavItem {
  title: string;
  icon?: string;
  link?: any[] | string;
  children?: NavItem[];
  expanded?: boolean;
  availableForRoles?: string[];
}

export interface AppNavTreeInterface {
  sideNav: NavItem[];
  settingsNav: NavItem[];
  profileMenuNav: NavItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationItemService implements NavigationItemServiceInterface {
  constructor(
    @Inject(APP_NAVIGATION_TREE_TOKEN)
    private appNavigationTree: AppNavTreeInterface
  ) {}

  getSideNavItems(user: PersonInterface): NavItem[] {
    return this.getNavItemsForTreeAndRoles('sideNav', user.roles);
  }

  getSettingsNavItems(user: PersonInterface): NavItem[] {
    return this.getNavItemsForTreeAndRoles('settingsNav', user.roles);
  }

  getProfileMenuNavItems(user: PersonInterface): NavItem[] {
    return this.getNavItemsForTreeAndRoles('profileMenuNav', user.roles);
  }

  private getNavItemsForTreeAndRoles(
    tree: string,
    roles: RoleInterface[]
  ): NavItem[] {
    return this.appNavigationTree[tree].filter(navItem =>
      navItem.availableForRoles.some(role =>
        roles.some(userRole => userRole.name === role)
      )
    );
  }
}
