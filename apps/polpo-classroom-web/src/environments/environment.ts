import { EnvironmentInterface } from '@campus/shared';
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
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
