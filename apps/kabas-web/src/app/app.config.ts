import { AppNavTreeInterface } from '@campus/shared';
import { NavItem } from '@campus/ui';

const standardSideNavItems: NavItem[] = [
  {
    title: 'Home',
    link: '/home'
  },
  {
    title: 'Methodes',
    link: '/methods',
    requiredPermissions: ['manageMethods']
  },
  {
    title: 'Taken',
    link: '/tasks'
  },
  {
    title: 'Resultaten',
    link: '/results'
  },
  {
    title: 'Vrij oefenen',
    link: '/practice',
    requiredPermissions: ['openUnlockedFreePractices']
  },
  {
    title: 'Vrij oefenen',
    link: '/practice/manage',
    requiredPermissions: ['manageUnlockedFreePractices']
  },
  {
    title: 'Differentiëren',
    link: '/differentiate'
  },
  {
    title: 'Instellingen',
    link: '/settings'
  },
  {
    title: 'Afmelden',
    link: '/logout'
  }
];

const standardSettingsNavItems: NavItem[] = [
  {
    title: 'Mijn gegevens',
    icon: 'profile',
    link: '/settings/profile',
    requiredPermissions: ['updateProfile']
  },
  {
    title: 'Verander profielfoto',
    icon: 'avatar',
    link: '/settings/profile/avatar',
    requiredPermissions: ['updateAvatar']
  },
  {
    title: 'Meldingen',
    icon: 'notifications',
    link: '/settings/alerts'
  }
];

const standardProfileMenuNavItems: NavItem[] = [];
export interface AppConfigInterface {
  appNavtree: AppNavTreeInterface;
}
export const kabasConfig: AppConfigInterface = {
  appNavtree: {
    sideNav: standardSideNavItems,
    settingsNav: standardSettingsNavItems,
    profileMenuNav: standardProfileMenuNavItems
  }
};
