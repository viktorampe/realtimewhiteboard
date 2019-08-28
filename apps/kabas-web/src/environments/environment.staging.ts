import { EduContentSearchResultComponent } from '../app/components/searchresults/edu-content-search-result.component';
import { ChapterLessonFilterFactory } from '../app/factories/chapter-lesson-filter/chapter-lesson-filter.factory';
import { DiaboloChapterLessonFilterFactory } from '../app/factories/chapter-lesson-filter/diabolo-chapter-lesson-filter.factory';
import { GlobalFilterFactory } from '../app/factories/global-filter/global-filter.factory';
import { icons } from './icons';

export const environment = {
  production: true,
  iconMapping: icons,
  website: {
    url: 'http://www.kabas.be',
    title: 'KABAS',
    favicon: 'assets/icons/favicon.ico'
  },
  logout: {
    url: 'http://www.kabas.be'
  },
  login: {
    url: 'http://www.kabas.be'
  },
  termPrivacy: {
    url: 'http://www.kabas.be'
  },
  api: {
    APIBase: 'https://api.staging.lk2020.be'
  },
  features: {
    alerts: {
      enabled: false,
      hasAppBarDropDown: false,
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
        }
      ]
    }
  },
  sso: {},
  searchModes: {
    'chapter-lesson': {
      name: 'chapter-lesson',
      label: 'Zoeken op <b>hoofdstuk</b>',
      dynamicFilters: false,
      searchTerm: {
        domHost: 'searchTerm'
      },
      searchFilterFactory: ChapterLessonFilterFactory,
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
    'diabolo-chapter-lesson': {
      name: 'diabolo-chapter-lesson',
      label: 'Zoeken op <b>hoofdstuk</b>',
      dynamicFilters: false,
      searchTerm: {
        domHost: 'searchTerm'
      },
      searchFilterFactory: DiaboloChapterLessonFilterFactory,
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
    global: {
      name: 'global',
      label: 'Zoeken in alle inhoud',
      dynamicFilters: false,
      searchTerm: {
        domHost: 'searchTerm'
      },
      searchFilterFactory: GlobalFilterFactory,
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
