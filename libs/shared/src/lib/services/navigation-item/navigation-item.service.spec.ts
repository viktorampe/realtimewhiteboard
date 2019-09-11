import { PersonFixture, RoleFixture } from '@campus/dal';
import {
  AppNavTreeInterface,
  NavigationItemService
} from './navigation-item.service';

describe('NavigationItemService', () => {
  const mockAppNavTree: AppNavTreeInterface = {
    sideNav: [
      {
        title: 'foo nav item',
        availableForRoles: ['roleA']
      },
      {
        title: 'bar nav item',
        availableForRoles: ['roleB']
      },
      {
        title: 'baz nav item',
        availableForRoles: ['roleA', 'roleB']
      }
    ],
    settingsNav: [
      {
        title: 'foo settings nav item',
        availableForRoles: ['roleA']
      },
      {
        title: 'bar settings nav item',
        availableForRoles: ['roleB']
      },
      {
        title: 'baz settings nav item',
        availableForRoles: ['roleB', 'roleC']
      }
    ],
    profileMenuNav: [
      {
        title: 'foo profile menu nav item',
        availableForRoles: ['roleA']
      },
      {
        title: 'bar profile menu nav item',
        availableForRoles: ['roleC']
      }
    ]
  };
  const service: NavigationItemService = new NavigationItemService(
    mockAppNavTree
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSideNavItems()', () => {
    const testCases = [
      {
        roles: [new RoleFixture({ name: 'roleA' })],
        expected: [mockAppNavTree.sideNav[0], mockAppNavTree.sideNav[2]]
      },
      {
        roles: [new RoleFixture({ name: 'roleB' })],
        expected: [mockAppNavTree.sideNav[1], mockAppNavTree.sideNav[2]]
      },
      {
        roles: [
          new RoleFixture({ name: 'roleA' }),
          new RoleFixture({ name: 'roleB' })
        ],
        expected: [
          mockAppNavTree.sideNav[0],
          mockAppNavTree.sideNav[1],
          mockAppNavTree.sideNav[2]
        ]
      },
      {
        roles: [
          new RoleFixture({ name: 'roleD' }),
          new RoleFixture({ name: 'roleB' })
        ],
        expected: [mockAppNavTree.sideNav[1], mockAppNavTree.sideNav[2]]
      },
      {
        roles: [new RoleFixture({ name: 'roleD' })],
        expected: []
      }
    ];
    it('should return the side nav items for the user', () => {
      const user = new PersonFixture();

      testCases.forEach(testCase => {
        user.roles = testCase.roles;

        const result = service.getSideNavItems(user);
        expect(result).toEqual(testCase.expected);
      });
    });

    it('should return the profile menu nav items for the user', () => {
      const user = new PersonFixture({
        roles: [new RoleFixture({ name: 'roleA' })]
      });

      const result = service.getProfileMenuNavItems(user);
      expect(result).toEqual([mockAppNavTree.profileMenuNav[0]]);
    });
  });

  describe('getSettingsNavItems()', () => {
    const user = new PersonFixture();
    const testCases = [
      {
        roles: [new RoleFixture({ name: 'roleA' })],
        expected: [mockAppNavTree.settingsNav[0]]
      },
      {
        roles: [new RoleFixture({ name: 'roleB' })],
        expected: [mockAppNavTree.settingsNav[1], mockAppNavTree.settingsNav[2]]
      },
      {
        roles: [new RoleFixture({ name: 'roleC' })],
        expected: [mockAppNavTree.settingsNav[2]]
      }
    ];
    it('should return the setting nav items for the user', () => {
      testCases.forEach(testCase => {
        user.roles = testCase.roles;

        const result = service.getSettingsNavItems(user);
        expect(result).toEqual(testCase.expected);
      });
    });
  });

  describe('getProfileMenuNavItems()', () => {
    const user = new PersonFixture();
    const testCases = [
      {
        roles: [new RoleFixture({ name: 'roleA' })],
        expected: [mockAppNavTree.profileMenuNav[0]]
      },
      {
        roles: [new RoleFixture({ name: 'roleB' })],
        expected: []
      },
      {
        roles: [new RoleFixture({ name: 'roleC' })],
        expected: [mockAppNavTree.profileMenuNav[1]]
      }
    ];

    it('should return the profile menu nav items for the user', () => {
      testCases.forEach(testCase => {
        user.roles = testCase.roles;

        const result = service.getProfileMenuNavItems(user);
        expect(result).toEqual(testCase.expected);
      });
    });
  });
});
