import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN
} from '../../auth';

export const APP_NAVIGATION_TREE_TOKEN = new InjectionToken<NavItem[]>(
  'AppNavigationTreeToken'
);

export const NAVIGATION_ITEM_SERVICE_TOKEN = new InjectionToken<
  NavigationItemService
>('NavigationItemService');

export interface NavigationItemServiceInterface {
  getSideNavItems(userPermissions: string[]): NavItem[];
  getSettingsNavItems(userPermissions: string[]): NavItem[];
  getProfileMenuNavItems(userPermissions: string[]): NavItem[];
}

export interface NavItem {
  title: string;
  icon?: string;
  link?: any[] | string;
  children?: NavItem[];
  expanded?: boolean;
  requiredPermissions?: string[];
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
    private appNavigationTree: AppNavTreeInterface,
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionServiceInterface
  ) {}

  getSideNavItems(userPermissions: string[]): NavItem[] {
    return this.getNavItemsForTreeAndRoles('sideNav', userPermissions);
  }

  getSettingsNavItems(userPermissions: string[]): NavItem[] {
    return this.getNavItemsForTreeAndRoles('settingsNav', userPermissions);
  }

  getProfileMenuNavItems(userPermissions: string[]): NavItem[] {
    return this.getNavItemsForTreeAndRoles('profileMenuNav', userPermissions);
  }

  private getNavItemsForTreeAndRoles(
    tree: string,
    availablePermissions: string[]
  ): NavItem[] {
    return this.appNavigationTree[tree].filter(navItem =>
      this.permissionService.hasPermission(
        [navItem.requiredPermissions],
        availablePermissions
      )
    );
  }
}
