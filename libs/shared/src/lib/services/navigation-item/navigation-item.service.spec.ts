import { Store } from '@ngrx/store';
import { PermissionService } from '../../auth';
import {
  AppNavTreeInterface,
  NavigationItemService
} from './navigation-item.service';

describe('NavigationItemService', () => {
  const mockAppNavTree: AppNavTreeInterface = {
    sideNav: [
      {
        title: 'foo nav item',
        requiredPermissions: ['permissionA']
      },
      {
        title: 'bar nav item',
        requiredPermissions: ['permissionB']
      },
      {
        title: 'baz nav item',
        requiredPermissions: ['permissionA', 'permissionB']
      }
    ],
    settingsNav: [
      {
        title: 'foo settings nav item',
        requiredPermissions: ['permissionA']
      },
      {
        title: 'bar settings nav item',
        requiredPermissions: ['permissionB']
      },
      {
        title: 'baz settings nav item',
        requiredPermissions: ['permissionA', 'permissionC']
      },
      {
        title: 'bak settings nav item',
        requiredPermissions: ['permissionB']
      }
    ],
    profileMenuNav: [
      {
        title: 'foo profile menu nav item',
        requiredPermissions: ['permissionA']
      },
      {
        title: 'bar profile menu nav item',
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

  describe('getSideNavItems()', () => {
    const testCases = [
      {
        userPermissions: ['permissionA'],
        expected: [mockAppNavTree.sideNav[0], mockAppNavTree.sideNav[2]]
      },
      {
        userPermissions: ['permissionB'],
        expected: [mockAppNavTree.sideNav[1], mockAppNavTree.sideNav[2]]
      },
      {
        userPermissions: ['permissionA', 'permissionB'],
        expected: [
          mockAppNavTree.sideNav[0],
          mockAppNavTree.sideNav[1],
          mockAppNavTree.sideNav[2]
        ]
      },
      {
        userPermissions: ['permissionC'],
        expected: []
      },
      {
        userPermissions: [],
        expected: []
      }
    ];
    it('should return the side nav items for the user', () => {
      testCases.forEach(testCase => {
        const result = service.getSideNavItems(testCase.userPermissions);
        expect(result).toEqual(testCase.expected);
      });
    });
  });

  describe('getSettingsNavItems()', () => {
    const testCases = [
      {
        requiredPermissions: ['permissionA'],
        expected: [mockAppNavTree.settingsNav[0], mockAppNavTree.settingsNav[2]]
      },
      {
        requiredPermissions: ['permissionB'],
        expected: [mockAppNavTree.settingsNav[1], mockAppNavTree.settingsNav[3]]
      },
      {
        requiredPermissions: ['permissionC'],
        expected: [mockAppNavTree.settingsNav[2]]
      }
    ];
    it('should return the setting nav items for the user', () => {
      testCases.forEach(testCase => {
        const result = service.getSettingsNavItems(
          testCase.requiredPermissions
        );
        expect(result).toEqual(testCase.expected);
      });
    });
  });

  describe('getProfileMenuNavItems()', () => {
    const testCases = [
      {
        requiredPermissions: ['permissionA'],
        expected: [mockAppNavTree.profileMenuNav[0]]
      },
      {
        requiredPermissions: ['permissionB'],
        expected: []
      },
      {
        requiredPermissions: ['permissionC'],
        expected: [mockAppNavTree.profileMenuNav[1]]
      }
    ];

    it('should return the profile menu nav items for the user', () => {
      testCases.forEach(testCase => {
        const result = service.getProfileMenuNavItems(
          testCase.requiredPermissions
        );
        expect(result).toEqual(testCase.expected);
      });
    });
  });
});
