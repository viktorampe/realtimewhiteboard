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
import { NavItemService } from './nav-item-service';

describe('NavItemServiceService', () => {
  let navService: NavItemService;
  let studentRole: RoleInterface;
  let teacherRole: RoleInterface;

  beforeAll(() => {
    studentRole = new RoleFixture({ name: 'student' });
    teacherRole = new RoleFixture({ name: 'teacher' });
  });

  beforeEach(() => {
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
        learningArea: new LearningAreaFixture({ icon: 'bar' })
      });
    });

    it('should return the standard navItems for a student', () => {
      mockUser.roles.push(studentRole);

      const result = navService.getSideNavItems(mockUser, []);
      const expected = [
        {
          icon: 'lesmateriaal',
          link: '/bundles',
          title: 'Bundels'
        },
        {
          icon: 'taak',
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
          link: '/results',
          title: 'Resultaten'
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard navItems for a teacher, without favorites', () => {
      mockUser.roles.push(teacherRole);

      const result = navService.getSideNavItems(mockUser, []);
      const expected = [
        {
          title: 'Bundels',
          icon: 'lesmateriaal',
          link: '/bundles',
          children: []
        },
        {
          title: 'Taken',
          icon: 'taak',
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
          link: '/results'
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard navItems for a teacher, with favorites', () => {
      mockUser.roles.push(teacherRole);

      const result = navService.getSideNavItems(mockUser, [mockFavorite]);
      const expected = [
        {
          title: 'Bundels',
          icon: 'lesmateriaal',
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
          icon: 'taak',
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
          link: '/results'
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('getProfileMenuItes', () => {
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
          internalLink: '/profile'
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout'
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
          internalLink: '/profile'
        },
        {
          description: 'foo',
          externalLink: 'foo.smartschool.be',
          header: 'Ga naar Smartschool',
          image: '/assets/images/icon-smartschool.png'
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout'
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
          internalLink: '/profile'
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout'
        }
      ];

      expect(result).toEqual(expected);
    });

    it('should return the standard profileMenuItems for a teacher, with credentials', () => {
      mockUser.roles.push(studentRole);

      const result = navService.getProfileMenuItems(mockUser, [
        mockCredential,
        mockCredential
      ]);
      const expected = [
        {
          description: 'Profiel',
          icon: 'account',
          internalLink: '/profile'
        },
        {
          description: 'foo',
          externalLink: 'foo.smartschool.be',
          header: 'Ga naar Smartschool',
          image: '/assets/images/icon-smartschool.png'
        },
        {
          description: 'foo',
          externalLink: 'foo.smartschool.be',
          header: 'Ga naar Smartschool',
          image: '/assets/images/icon-smartschool.png'
        },
        {
          description: 'Afmelden',
          icon: 'lock',
          internalLink: '/logout'
        }
      ];

      expect(result).toEqual(expected);
    });
  });
});
