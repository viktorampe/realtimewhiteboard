import { Type } from '@angular/core';
import { SearchFilterFactory } from '@campus/search';
import { EnvironmentInterface } from '@campus/shared';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { PolpoResultItemComponent } from 'libs/devlib/src/lib/polpo-result-item/polpo-result-item.component';
import { icons } from './icons';

export const environment: EnvironmentInterface = {
  production: true,
  // promo website settings
  website: {
    title: 'POLPO - staging',
    favicon: 'assets/icons/favicon.ico',
    url: 'https://www.staging.polpo.be'
  },
  login: {
    url: 'https://www.staging.polpo.be/identificatie/start'
  },
  logout: {
    url: 'https://www.staging.polpo.be/identificatie/start'
  },
  iconMapping: icons,
  api: {
    APIBase: 'https://api.staging.polpo.be'
  },
  features: {
    alerts: {
      enabled: true,
      hasAppBarDropDown: true,
      appBarPollingInterval: 3000
    },
    messages: {
      enabled: false,
      hasAppBarDropDown: false
    },
    errorManagement: {
      managedStatusCodes: [500, 401, 404, 0],
      allowedErrors: [
        {
          status: 404,
          statusText: 'Not Found',
          urlRegex: 'http.*assets\\/icons.*.svg'
        }
      ]
    }
  },
  sso: {
    facebook: {
      enabled: true,
      linkUrl: 'https://api.staging.polpo.be/link/facebook/callback',
      description: 'Facebook',
      logoIcon: 'facebook',
      className: 'button-facebook'
    },
    google: {
      enabled: true,
      linkUrl: 'https://api.staging.polpo.be/link/google/callback',
      description: 'Google',
      logoIcon: 'google',
      className: 'button-google'
    },
    smartschool: {
      enabled: true,
      linkUrl: 'https://api.staging.polpo.be/link/smartschool/callback',
      description: 'Smartschool',
      logoIcon: 'smartschool:orange',
      className: 'button-smartschool',
      maxNumberAllowed: 10
    }
  },
  searchModes: {
    toc: {
      name: 'toc',
      label: 'Inhoudstafel',
      dynamicFilters: false,
      //TODO: All '{} as Type' must be replaced with actual components
      searchFilterFactory: {} as Type<SearchFilterFactory>,
      results: {
        component: PolpoResultItemComponent,
        sortModes: [
          {
            description: 'book',
            name: 'book',
            icon: 'book'
          },
          {
            description: 'bundle',
            name: 'bundle',
            icon: 'bundle'
          },
          {
            description: 'taak',
            name: 'taak',
            icon: 'taak'
          }
        ],
        pageSize: 20
      }
    },
    plan: {
      name: 'plan',
      label: 'Leerplan',
      dynamicFilters: false,
      searchFilterFactory: {} as Type<SearchFilterFactory>,
      results: {
        component: PolpoResultItemComponent,
        sortModes: [
          {
            description: 'book',
            name: 'book',
            icon: 'book'
          },
          {
            description: 'bundle',
            name: 'bundle',
            icon: 'bundle'
          },
          {
            description: 'taak',
            name: 'taak',
            icon: 'taak'
          }
        ],
        pageSize: 20
      }
    },
    search: {
      name: 'search',
      label: 'Standaard zoeken',
      dynamicFilters: true,
      searchFilterFactory: {} as Type<SearchFilterFactory>,
      results: {
        component: PolpoResultItemComponent,
        sortModes: [
          {
            description: 'book',
            name: 'book',
            icon: 'book'
          },
          {
            description: 'bundle',
            name: 'bundle',
            icon: 'bundle'
          },
          {
            description: 'taak',
            name: 'taak',
            icon: 'taak'
          }
        ],
        pageSize: 20
      }
    }
  }
};
