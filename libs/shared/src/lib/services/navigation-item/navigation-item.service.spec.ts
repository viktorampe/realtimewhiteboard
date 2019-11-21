import { Store } from '@ngrx/store';
import { AppNavTreeInterface, AppNavTreeKeys } from '.';
import { PermissionService } from '../../auth';
import { NavigationItemService } from './navigation-item.service';

describe('NavigationItemService', () => {
  const mockAppNavTree: AppNavTreeInterface = {
    sideNav: [
      {
        title: 'side nav item 1',
        requiredPermissions: ['permissionA']
      },
      {
        title: 'side nav item 2',
        requiredPermissions: ['permissionB']
      },
      {
        title: 'side nav item 3',
        requiredPermissions: [['permissionA', 'permissionB']]
      },
      {
        title: 'nav item that has an empty required permissions array', // should always be returned
        requiredPermissions: []
      },
      {
        title: 'nav item that does not have requiredPermissions key' // should always be returned
      },
      {
        title: 'nav item that has a single hideWhenRequiredPermissions',
        hideWhenRequiredPermissions: ['permissionA']
      },
      {
        title: 'nav item that has multiple hideWhenRequiredPermissions',
        hideWhenRequiredPermissions: [['permissionA', 'permissionB']]
      }
    ],
    settingsNav: [
      {
        title: 'settings nav item 1',
        requiredPermissions: ['permissionA']
      },
      {
        title: 'settings nav item 2',
        requiredPermissions: ['permissionB']
      },
      {
        title: 'settings nav item 2',
        requiredPermissions: [['permissionA', 'permissionC']]
      },
      {
        title: 'settings nav item 3',
        requiredPermissions: ['permissionB']
      }
    ],
    profileMenuNav: [
      {
        title: 'profile menu nav item 1',
        requiredPermissions: ['permissionA']
      },
      {
        title: 'profile menu nav item 2',
        requiredPermissions: ['permissionC']
      }
    ]
  };
  const permissionService = new PermissionService({} as Store<any>);
  const service: NavigationItemService = new NavigationItemService(
    mockAppNavTree,
    permissionService
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNavItemsForTree', () => {
    const testCases = [
      {
        tree: 'sideNav',
        userPermissions: ['permissionA'],
        expected: [
          mockAppNavTree.sideNav[0],
          mockAppNavTree.sideNav[2],
          mockAppNavTree.sideNav[3],
          mockAppNavTree.sideNav[4]
        ]
      },
      {
        tree: 'sideNav',
        userPermissions: ['permissionB'],
        expected: [
          mockAppNavTree.sideNav[1],
          mockAppNavTree.sideNav[2],
          mockAppNavTree.sideNav[3],
          mockAppNavTree.sideNav[4],
          mockAppNavTree.sideNav[5]
        ]
      },
      {
        tree: 'sideNav',
        userPermissions: ['permissionA', 'permissionB'],
        expected: [
          mockAppNavTree.sideNav[0],
          mockAppNavTree.sideNav[1],
          mockAppNavTree.sideNav[2],
          mockAppNavTree.sideNav[3],
          mockAppNavTree.sideNav[4]
        ]
      },
      {
        tree: 'sideNav',
        userPermissions: ['permissionC'],
        expected: [
          mockAppNavTree.sideNav[3],
          mockAppNavTree.sideNav[4],
          mockAppNavTree.sideNav[5],
          mockAppNavTree.sideNav[6]
        ]
      },
      {
        tree: 'sideNav',
        userPermissions: [],
        expected: [
          mockAppNavTree.sideNav[3],
          mockAppNavTree.sideNav[4],
          mockAppNavTree.sideNav[5],
          mockAppNavTree.sideNav[6]
        ]
      },
      {
        tree: 'settingsNav',
        userPermissions: ['permissionA'],
        expected: [mockAppNavTree.settingsNav[0], mockAppNavTree.settingsNav[2]]
      },
      {
        tree: 'profileMenuNav',
        userPermissions: ['permissionA'],
        expected: [mockAppNavTree.profileMenuNav[0]]
      }
    ];

    it('should return the nav items for the provided tree and permissions', () => {
      testCases.forEach(testCase => {
        const result = service.getNavItemsForTree(
          testCase.tree as AppNavTreeKeys,
          testCase.userPermissions
        );
        expect(result).toEqual(testCase.expected);
      });
    });
  });
});
