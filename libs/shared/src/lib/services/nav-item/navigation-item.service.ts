import { Injectable, InjectionToken } from '@angular/core';
import { PersonInterface } from '@campus/dal';
import { Dictionary } from '@ngrx/entity';

interface NavItem {
  title: string;
  icon?: string;
  link?: any[] | string;
  children?: NavItem[];
  expanded?: boolean;
  availableFor?: string[];
}

const APP_NAVIGATION_TREE_TOKEN = new InjectionToken<NavItem[]>(
  'AppNavigationTreeToken'
);

export interface AppNavTreeInterface {
  sideNav: Dictionary<NavItem>;
  settingsNav: Dictionary<NavItem>;
  profileMenuNav: Dictionary<NavItem>;
}

const standardSideNavItems: Dictionary<NavItem> = {
  home: {
    title: 'Dashboard',
    icon: 'home',
    link: '/home'
  },
  methodes: {
    title: 'Methodes',
    icon: 'book',
    link: '/methods'
  },
  taken: {
    title: 'Taken',
    icon: '',
    link: '/tasks'
  },
  resultaten: {
    title: 'Resultaten',
    icon: '',
    link: '/results'
  },
  'vrij-oefenen': {
    title: 'Vrij oefenen',
    icon: '',
    link: '/practice'
  },
  differentiëren: {
    title: 'Differentiëren',
    icon: '',
    link: ''
  },
  settings: {
    title: 'Instellingen',
    icon: 'settings',
    link: '/settings'
  },
  oefenen: {
    title: 'Oefenen',
    icon: '',
    link: '/oefenen'
  }
};

const standardSettingsNavItems: Dictionary<NavItem> = {
  profile: {
    title: 'Mijn gegevens',
    icon: 'profile',
    link: '/settings/profile'
  },
  avatar: {
    title: 'Verander profielfoto',
    icon: 'avatar',
    link: '/settings/profile/avatar'
  },
  meldingen: {
    title: 'Meldingen',
    icon: 'notifications',
    link: '/settings/alerts'
  }
};

const standardProfileMenuNavItems: Dictionary<NavItem> = {
  profile: standardSettingsNavItems.profile
};

const KabasNavTree: AppNavTreeInterface = {
  sideNav: standardSideNavItems,
  settingsNav: standardSettingsNavItems,
  profileMenuNav: standardProfileMenuNavItems
};

const roleNavigationMap: { [key: string]: Dictionary<string[]> } = {
  teacher: {
    sideNav: [
      'home',
      'methodes',
      'taken',
      'resultaten',
      'vrij oefenen',
      'differentiëren',
      'instellingen'
    ],
    settingsNav: ['profile', 'avatar', 'meldingen'],
    profileMenuNav: ['']
  },
  student: {
    sideNav: ['home', 'oefenen'],
    settingsNav: ['profile'],
    profileMenuNav: []
  }
};

@Injectable({
  providedIn: 'root'
})
export class NavigationItemService {
  constructor() // @Inject(APP_NAVIGATION_TREE_TOKEN)
  // private appNavigationTree: AppNavTreeInterface
  {}

  getSideNavItems(user: PersonInterface): NavItem[] {
    if (user.roles.some(role => role.name === 'student')) {
      return roleNavigationMap.student.sideNav.map(
        navItemKey => KabasNavTree.sideNav[navItemKey]
      );
    }

    if (user.roles.some(role => role.name === 'teacher')) {
      return roleNavigationMap.teacher.sideNav.map(
        navItemKey => KabasNavTree.sideNav[navItemKey]
      );
    }
  }

  getSettingsNavItems(user: PersonInterface): NavItem[] {
    return [];
  }
}
