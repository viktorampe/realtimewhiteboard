import { Type } from '@angular/core';
import { SearchFilterFactory } from '@campus/search';
import { EnvironmentInterface } from '@campus/shared';
import { EduContentSearchResultComponent } from '../app/components/searchresults/edu-content-search-result.component';
import { GlobalSearchTermFilterFactory } from '../app/factories/global-search-term-filter/global-search-term-filter.factory';
import { SearchTermFilterFactory } from '../app/factories/search-term-filter/search-term-filter.factory';
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
  termPrivacy: {
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
        },
        {
          status: 404,
          messageRegex: 'no_teacher_found_for_given_key'
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
      label: 'Zoeken op <b>inhoudstafel</b>',
      dynamicFilters: false,
      //TODO: All '{} as Type' must be replaced with actual components
      searchFilterFactory: {} as Type<SearchFilterFactory>,
      results: {
        component: EduContentSearchResultComponent,
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
      label: 'Zoeken op <b>leerplan</b>',
      dynamicFilters: false,
      searchFilterFactory: {} as Type<SearchFilterFactory>,
      results: {
        component: EduContentSearchResultComponent,
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
    term: {
      name: 'term',
      label: '<b>Standaard</b> zoeken',
      dynamicFilters: false,
      searchTerm: {
        domHost: 'hostTop'
      },
      searchFilterFactory: SearchTermFilterFactory,
      results: {
        component: EduContentSearchResultComponent,
        sortModes: [
          {
            description: 'relevantie',
            name: '_score',
            icon: 'sort-numeric-down'
          },
          {
            description: 'alfabetisch',
            name: 'title.raw',
            icon: 'sort-alpha-down'
          },
          {
            description: 'laatst gewijzigd',
            name: 'published',
            icon: 'calendar-plus'
          }
        ],
        pageSize: 20
      }
    },
    globalterm: {
      name: 'globalterm',
      label: '<b>Standaard</b> zoeken',
      dynamicFilters: true,
      searchTerm: {
        domHost: 'hostTop'
      },
      searchFilterFactory: GlobalSearchTermFilterFactory,
      results: {
        component: EduContentSearchResultComponent,
        sortModes: [
          {
            description: 'relevantie',
            name: '_score',
            icon: 'sort-numeric-down'
          },
          {
            description: 'alfabetisch',
            name: 'title.raw',
            icon: 'sort-alpha-down'
          },
          {
            description: 'laatst gewijzigd',
            name: 'published',
            icon: 'calendar-plus'
          }
        ],
        pageSize: 20
      }
    }
  }
};
