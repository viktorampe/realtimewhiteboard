import { EnvironmentInterface } from '@campus/shared';
import { EduContentSearchResultComponent } from '../app/components/searchresults/edu-content-search-result.component';
import { GlobalSearchTermFilterFactory } from '../app/factories/global-search-term-filter/global-search-term-filter.factory';
import { LearningPlanFilterFactory } from '../app/factories/learning-plan-filter/learning-plan-filter.factory';
import { SearchTermFilterFactory } from '../app/factories/search-term-filter/search-term-filter.factory';
import { TocFilterFactory } from '../app/factories/toc-filter/toc-filter.factory';
import { icons } from './icons';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: EnvironmentInterface = {
  production: false,
  iconMapping: icons,
  // promo website settings
  website: {
    url: 'http://www.polpo.localhost',
    title: 'POLPO',
    favicon: 'assets/icons/favicon.ico'
  },
  logout: {
    url: 'http://student.polpo.localhost:3014/dev'
  },
  login: {
    url: 'http://student.polpo.localhost:3014/dev'
  },
  termPrivacy: {
    url: 'http://student.polpo.localhost:3014/dev'
  },
  api: {
    APIBase: 'http://api.polpo.localhost:3000'
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
      linkUrl: 'http://api.polpo.localhost:3000/link/facebook/callback',
      description: 'Facebook',
      logoIcon: 'facebook',
      className: 'button-facebook'
    },
    google: {
      enabled: true,
      linkUrl: 'http://api.polpo.localhost:3000/link/google/callback',
      description: 'Google',
      logoIcon: 'google',
      className: 'button-google'
    },
    smartschool: {
      enabled: true,
      linkUrl: 'http://api.polpo.localhost:3000/link/smartschool/callback',
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
      dynamicFilters: true,
      searchFilterFactory: TocFilterFactory,
      results: {
        component: EduContentSearchResultComponent,
        sortModes: [
          {
            description: 'alfabetisch',
            name: 'title.raw',
            icon: 'sort-alpha-down'
          }
        ],
        pageSize: 20
      }
    },
    plan: {
      name: 'plan',
      label: 'Zoeken op <b>leerplan</b>',
      dynamicFilters: true,
      searchFilterFactory: LearningPlanFilterFactory,
      results: {
        component: EduContentSearchResultComponent,
        sortModes: [
          {
            description: 'alfabetisch',
            name: 'title.raw',
            icon: 'sort-alpha-down'
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
  },
  testing: {
    removeDataCyAttributes: false
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
