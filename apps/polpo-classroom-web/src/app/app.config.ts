import { SettingsPermissions } from '@campus/dal';
import { AppNavTreeInterface } from '@campus/shared';
import { NavItem } from '@campus/ui';

const standardSideNavItems: NavItem[] = [];

const standardSettingsNavItems: NavItem[] = [
  {
    title: 'Mijn gegevens',
    icon: 'profile',
    link: '/settings/profile',
    requiredPermissions: [SettingsPermissions.UPDATE_PROFILE]
  },
  {
    title: 'Verander profielfoto',
    icon: 'avatar',
    link: '/settings/profile/avatar',
    requiredPermissions: [SettingsPermissions.UPDATE_AVATAR]
  },
  {
    title: 'Mijn koppelingen',
    icon: 'credentials',
    link: '/settings/credentials',
    requiredPermissions: [SettingsPermissions.ADD_CREDENTIALS]
  },
  {
    title: 'Mijn leerkrachten',
    icon: 'coupled-teachers',
    link: '/settings/coupled-teachers',
    requiredPermissions: [
      SettingsPermissions.LINK_TEACHERS,
      SettingsPermissions.UNLINK_TEACHERS
    ]
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
