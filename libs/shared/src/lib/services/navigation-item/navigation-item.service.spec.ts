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
    ]
  };
  const service: NavigationItemService = new NavigationItemService(
    mockAppNavTree
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSideNavItems()', () => {
    it('should return the side nav items for the provide role', () => {
      const user = new PersonFixture({
        roles: [new RoleFixture({ name: 'roleA' })]
      });

      const result = service.getSideNavItems(user);
      expect(result).toEqual([
        {
          title: 'foo nav item',
          availableForRoles: ['roleA']
        },
        {
          title: 'baz nav item',
          availableForRoles: ['roleA', 'roleB']
        }
      ]);
    });
  });
});
