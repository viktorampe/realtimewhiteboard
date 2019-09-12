import { InjectionToken } from '@angular/core';
import { NavigationItemService } from '.';

export const APP_NAVIGATION_TREE_TOKEN = new InjectionToken<NavItem[]>(
  'AppNavigationTreeToken'
);

export const NAVIGATION_ITEM_SERVICE_TOKEN = new InjectionToken<
  NavigationItemService
>('NavigationItemService');

export interface NavigationItemServiceInterface {
  getNavItemsForTree(
    tree: AppNavTreeKeys,
    userPermissions: string[]
  ): NavItem[];
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

export type AppNavTreeKeys = keyof AppNavTreeInterface;
