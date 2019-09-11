import { PersonFixture, RoleFixture } from '@campus/dal';
import { NavigationItemService } from './navigation-item.service';

describe('NavigationItemService', () => {
  const service: NavigationItemService = new NavigationItemService();

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSideNavItems()', () => {
    it('should return the side nav items for a student', () => {
      const user = new PersonFixture({
        roles: [new RoleFixture({ name: 'student' })]
      });

      const result = service.getSideNavItems(user);
      expect(result).toEqual([
        { title: 'Dashboard', icon: 'home', link: '/home' },
        { title: 'Oefenen', icon: '', link: '/oefenen' }
      ]);
    });
  });
});
