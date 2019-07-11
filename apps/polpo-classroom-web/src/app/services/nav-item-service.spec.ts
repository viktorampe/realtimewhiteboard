import { inject, TestBed } from '@angular/core/testing';
import {
  FavoriteFixture,
  FavoriteInterface,
  LearningAreaFixture,
  PassportUserCredentialInterface,
  PersonFixture,
  PersonInterface,
  RoleFixture,
  RoleInterface
} from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { NavItemService } from './nav-item-service';

describe('NavItemServiceService', () => {
  let navService: NavItemService;
  let studentRole: RoleInterface;
  let teacherRole: RoleInterface;

  beforeAll(() => {
    studentRole = new RoleFixture({ name: 'student' });
    teacherRole = new RoleFixture({ name: 'teacher' });
  });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [NavItemService]
    });

    navService = TestBed.get(NavItemService);
  });

  it('should be created', inject(
    [NavItemService],
    (service: NavItemService) => {
      expect(service).toBeTruthy();
    }
  ));

  describe('getSideNavItems', () => {
    let mockUser: PersonInterface;
    let mockFavorite: FavoriteInterface;

    beforeEach(() => {
      mockUser = new PersonFixture();
      mockFavorite = new FavoriteFixture({
        learningArea: new LearningAreaFixture({
          icon: 'learning-area:polpo-bar'
        })
      });
    });

    it('should return the standard navItems for a student', () => {
      mockUser.roles.push(studentRole);

      const result = navService.getSideNavItems(mockUser, []);
      const expected = [
        {
          icon: 'bundles',
          link: '/bundles',
          title: 'Bundels'
        },
        {
          icon: 'task',
          link: '/tasks',
          title: 'Taken'
        },
        {
          icon: 'book',
          link: '/books',
          title: 'Boeken'
        },
        {
          icon: 'increase',
          link: '/reports',
          title: 'Resultaten'
        },
        {
          icon: 'settings',
          link: '/settings',
          title: 'Instellingen'
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard navItems for a teacher, without favorites', () => {
      mockUser.roles.push(teacherRole);

      const result = navService.getSideNavItems(mockUser, []);
      const expected = [
        {
          title: 'Lesmateriaal',
          icon: 'lesmateriaal',
          link: '/edu-content',
          children: []
        },
        {
          title: 'Bundels',
          icon: 'bundles',
          link: '/bundles',
          children: []
        },
        {
          title: 'Taken',
          icon: 'task',
          link: '/tasks',
          children: []
        },
        {
          title: 'Boeken',
          icon: 'book',
          link: '/books',
          children: []
        },
        {
          title: 'Resultaten',
          icon: 'increase',
          link: '/reports'
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard navItems for a teacher, with favorites', () => {
      mockUser.roles.push(teacherRole);

      const result = navService.getSideNavItems(mockUser, [mockFavorite]);
      const expected = [
        {
          title: 'Lesmateriaal',
          icon: 'lesmateriaal',
          link: '/edu-content',
          children: [
            {
              title: mockFavorite.name,
              icon: mockFavorite.learningArea.icon,
              link: '/edu-content/' + mockFavorite.learningAreaId
            }
          ]
        },
        {
          title: 'Bundels',
          icon: 'bundles',
          link: '/bundles',
          children: [
            {
              title: mockFavorite.name,
              icon: mockFavorite.learningArea.icon,
              link: '/bundles/' + mockFavorite.learningAreaId
            }
          ]
        },
        {
          title: 'Taken',
          icon: 'task',
          link: '/tasks',
          children: [
            {
              title: mockFavorite.name,
              icon: mockFavorite.learningArea.icon,
              link: '/tasks/' + mockFavorite.learningAreaId
            }
          ]
        },
        {
          title: 'Boeken',
          icon: 'book',
          link: '/books',
          children: [
            {
              title: mockFavorite.name,
              icon: mockFavorite.learningArea.icon,
              link: '/books/' + mockFavorite.learningAreaId
            }
          ]
        },
        {
          title: 'Resultaten',
          icon: 'increase',
          link: '/reports'
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('getProfileMenuItems', () => {
    let mockUser: PersonInterface;
    let mockCredential: PassportUserCredentialInterface;

    beforeEach(() => {
      mockUser = new PersonFixture();
      mockCredential = {
        profile: { platform: 'foo.smartschool.be' },
        provider: 'smartschool'
      };
    });

    it('should return the standard profileMenuItems for a student, without credentials', () => {
      mockUser.roles.push(studentRole);

      const result = navService.getProfileMenuItems(mockUser, []);
      const expected = [
        {
          description: 'Profiel',
          icon: 'account',
          internalLink: '/settings/profile',
          dividerBefore: false
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout',
          dividerBefore: true
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard profileMenuItems for a student, with credentials', () => {
      mockUser.roles.push(studentRole);

      const result = navService.getProfileMenuItems(mockUser, [mockCredential]);
      const expected = [
        {
          description: 'Profiel',
          icon: 'account',
          internalLink: '/settings/profile',
          dividerBefore: false
        },
        {
          description: 'foo',
          externalLink: 'foo.smartschool.be',
          image: '/assets/images/icon-smartschool.png',
          dividerBefore: true
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout',
          dividerBefore: true
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard profileMenuItems for a teacher, without credentials', () => {
      mockUser.roles.push(teacherRole);

      const result = navService.getProfileMenuItems(mockUser, []);
      const expected = [
        {
          description: 'Profiel',
          icon: 'account',
          internalLink: '/settings/profile',
          dividerBefore: false
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout',
          dividerBefore: true
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard profileMenuItems for a teacher, with credentials', () => {
      mockUser.roles.push(teacherRole);

      const result = navService.getProfileMenuItems(mockUser, [
        mockCredential,
        mockCredential
      ]);
      const expected = [
        {
          description: 'Profiel',
          icon: 'account',
          internalLink: '/settings/profile',
          dividerBefore: false
        },
        {
          description: 'foo',
          externalLink: 'foo.smartschool.be',
          image: '/assets/images/icon-smartschool.png',
          dividerBefore: true
        },
        {
          description: 'foo',
          externalLink: 'foo.smartschool.be',
          image: '/assets/images/icon-smartschool.png',
          dividerBefore: false
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout',
          dividerBefore: true
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should exclude non-smartschool credentials', () => {
      mockUser.roles.push(teacherRole);
      const mockNonSmartschoolCredential = {
        profile: { platform: 'foo.zeker-niet-smartschool.be' },
        provider: 'zeker-niet-smartschool'
      };

      const result = navService.getProfileMenuItems(mockUser, [
        mockNonSmartschoolCredential
      ]);
      const expected = [
        {
          description: 'Profiel',
          icon: 'account',
          internalLink: '/settings/profile',
          dividerBefore: false
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout',
          dividerBefore: true
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should only place a divider before the first smartschool link', () => {
      mockUser.roles.push(studentRole);

      const result = navService.getProfileMenuItems(mockUser, [
        mockCredential,
        mockCredential,
        mockCredential,
        mockCredential
      ]);

      const resultSmartschoolLinks = result.filter(
        link => link.externalLink && link.externalLink.includes('smartschool')
      );

      expect(resultSmartschoolLinks[0].dividerBefore).toBe(true);
      expect(
        resultSmartschoolLinks
          .slice(1)
          .every(link => link.dividerBefore === false)
      ).toBe(true);
    });
  });
});
