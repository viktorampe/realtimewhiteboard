import { EnvironmentInterface } from '@campus/shared';
import { EduContentSearchResultComponent } from '../app/components/searchresults/edu-content-search-result.component';
import { ChapterLessonFilterFactory } from '../app/factories/chapter-lesson-filter/chapter-lesson-filter.factory';
import { icons } from './icons';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: EnvironmentInterface = {
  production: false,
  iconMapping: icons,
  website: {
    url: 'http://www.kabas.localhost',
    title: 'KABAS',
    favicon: 'assets/icons/favicon.ico'
  },
  logout: {
    url: 'http://www.kabas.localhost:3020/dev'
  },
  login: {
    url: 'http://www.kabas.localhost:3020/dev'
  },
  termPrivacy: {
    url: 'http://www.kabas.localhost:3020/dev'
  },
  api: {
    APIBase: 'http://api.kabas.localhost:3000'
  },
  features: {
    alerts: {
      enabled: false,
      hasAppBarDropDown: false,
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
  sso: {},
  searchModes: {
    'chapter-lesson': {
      name: 'chapter-lesson',
      label: 'Zoeken op <b>hoofdstuk</b>',
      dynamicFilters: false,
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
    }
  },
  testing: {
    removeDataCyAttributes: false
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
