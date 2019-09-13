import { AppNavTreeInterface } from '@campus/shared';
import { NavItem } from '@campus/ui';

const standardSideNavItems: NavItem[] = [];

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
export const polpoConfig: AppConfigInterface = {
  appNavtree: {
    sideNav: standardSideNavItems,
    settingsNav: standardSettingsNavItems,
    profileMenuNav: standardProfileMenuNavItems
  }
};
