import { FavoriteTypesEnum } from '@campus/dal';
import { EduContentSearchResultComponent } from '../app/components/searchresults/edu-content-search-result.component';
import { GlobalSearchTermFilterFactory } from '../app/factories/global-search-term-filter/global-search-term-filter.factory';
import { LearningPlanFilterFactory } from '../app/factories/learning-plan-filter/learning-plan-filter.factory';
import { SearchTermFilterFactory } from '../app/factories/search-term-filter/search-term-filter.factory';
import { TocFilterFactory } from '../app/factories/toc-filter/toc-filter.factory';
import { icons } from './icons';

export const environment = {
  production: true,
  // promo website settings
  website: {
    url: 'https://www.polpo.be',
    title: 'POLPO',
    favicon: 'assets/icons/favicon.ico'
  },
  login: {
    url: 'https://www.polpo.be/identificatie/start'
  },
  logout: {
    url: 'https://www.polpo.be/identificatie/start'
  },
  termPrivacy: {
    url: 'https://www.polpo.be/identificatie/start'
  },
  iconMapping: icons,
  api: {
    APIBase: 'https://api.polpo.be'
  },
  features: {
    alerts: {
      enabled: true,
      hasAppBarDropDown: true,
      appBarPollingInterval: 30000
    },
    messages: {
      enabled: false,
      hasAppBarDropDown: false
    },
    errorManagement: {
      managedStatusCodes: [500, 401, 404],
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
    },
    globalSearch: {
      enabled: false
    },
    favorites: {
      allowedFavoriteTypes: [
        FavoriteTypesEnum.BOEKE,
        FavoriteTypesEnum.BUNDLE,
        FavoriteTypesEnum.TASK,
        FavoriteTypesEnum.EDUCONTENT,
        FavoriteTypesEnum.AREA
      ]
    }
  },
  sso: {
    facebook: {
      enabled: true,
      linkUrl: 'https://api.polpo.be/link/facebook/callback',
      description: 'Facebook',
      logoIcon: 'facebook',
      className: 'button-facebook'
    },
    google: {
      enabled: true,
      linkUrl: 'https://api.polpo.be/link/google/callback',
      description: 'Google',
      logoIcon: 'google',
      className: 'button-google'
    },
    smartschool: {
      enabled: true,
      linkUrl: 'https://api.polpo.be/link/smartschool/callback',
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
    removeDataCyAttributes: true
  },
  ui: {}
};
