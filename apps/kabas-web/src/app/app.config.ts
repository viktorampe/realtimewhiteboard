import { AppNavTreeInterface } from '@campus/shared';
import { NavItem } from '@campus/ui';

const standardSideNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Methodes',
    icon: 'book',
    link: '/methods'
  },
  {
    title: 'Taken',
    icon: '',
    link: '/tasks'
  },
  {
    title: 'Resultaten',
    icon: '',
    link: '/results'
  },
  {
    title: 'Vrij oefenen',
    icon: '',
    link: '/practice'
  },
  {
    title: 'Differentiëren',
    icon: '',
    link: ''
  },
  {
    title: 'Instellingen',
    icon: 'settings',
    link: '/settings'
  },
  {
    title: 'Oefenen',
    icon: '',
    link: '/oefenen'
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
