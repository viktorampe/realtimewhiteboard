// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  iconMapping: {
    lock: 'assets/icons/lock.svg',
    checkmark: 'assets/icons/checkmark.svg',
    hourglass: 'assets/icons/hourglass.svg',
    'learning-area:wiskunde': 'assets/icons/wiskunde-lg.svg'
  },
  // promo website settings
  website: {
    url: 'http://www.polpo.localhost'
  },
  APIBase: 'http://api.polpo.localhost:3000',
  features: {
    alerts: {
      enabled: true,
      hasAppBarDropDown: true,
      appBarPollingInterval: 3000
    },
    messages: {
      enabled: true,
      hasAppBarDropDown: true
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
