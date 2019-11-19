import { Inject, Injectable } from '@angular/core';
import { NavItem } from '@campus/ui';
import {
  PermissionServiceInterface,
  PERMISSION_SERVICE_TOKEN
} from '../../auth';
import {
  AppNavTreeInterface,
  AppNavTreeKeys,
  APP_NAVIGATION_TREE_TOKEN,
  NavigationItemServiceInterface
} from './navigation-item.service.interface';

@Injectable({
  providedIn: 'root'
})
export class NavigationItemService implements NavigationItemServiceInterface {
  constructor(
    @Inject(APP_NAVIGATION_TREE_TOKEN)
    private appNavigationTree: AppNavTreeInterface,
    @Inject(PERMISSION_SERVICE_TOKEN)
    private permissionService: PermissionServiceInterface
  ) { }

  getNavItemsForTree(
    tree: AppNavTreeKeys,
    userPermissions: string[]
  ): NavItem[] {
    return this.appNavigationTree[tree].filter(navItem => {
      return (
        // hide nav item when a userPermissions is found in hideWhenRequiredPermissions
        !(
          navItem.hideWhenRequiredPermissions &&
          this.permissionService.hasPermission(
            navItem.hideWhenRequiredPermissions,
            userPermissions
          )
        )
        &&
        (
          // if the nav item doesn't have a requiredPermissions key --> return true
          !navItem.requiredPermissions ||
          this.permissionService.hasPermission(
            navItem.requiredPermissions,
            userPermissions
          )
        )
      );
    });
  }
}
