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
    link: '/tasks/manage',
    requiredPermissions: ['manageTasks']
  },
  {
    title: 'Taken',
    link: '/tasks',
    requiredPermissions: ['openTasks']
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

const standardDashboardNavItems: NavItem[] = [
  {
    title: 'Methodes',
    description:
      'Je bordboeken en lesmateriaal in een handig overzicht + de status van je leerplan',
    link: '/methods',
    icon: 'methods',
    requiredPermissions: ['manageMethods']
  },
  {
    title: 'Taken',
    description: 'Geef taken aan je klassen en/of individuele leerlingen',
    link: '/tasks/manage',
    icon: 'tasks',
    requiredPermissions: ['manageTasks']
  },
  {
    title: 'Taken',
    link: '/tasks',
    description: 'Maak taken die voor jou zijn klaargezet.',
    icon: 'tasks',
    requiredPermissions: ['openTasks']
  },
  {
    title: 'Resultaten',
    description:
      'Resultaten van oefeningen per taak of per leerling, met de mogelijkheid om dit te exporteren',
    icon: 'results',
    link: '/results',
    requiredPermissions: [] // TODO: add permissions
  },
  {
    title: 'Differentiëren',
    description: 'Suggesties per leerling op basis van behaalde doelen',
    icon: 'differentiate',
    link: '/differentiate',
    requiredPermissions: [] // TODO: add permissions
  }
];
export interface AppConfigInterface {
  appNavtree: AppNavTreeInterface;
}
export const kabasConfig: AppConfigInterface = {
  appNavtree: {
    dashboardNav: standardDashboardNavItems,
    sideNav: standardSideNavItems,
    settingsNav: standardSettingsNavItems,
    profileMenuNav: standardProfileMenuNavItems
  }
};
