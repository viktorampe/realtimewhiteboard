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
    APIBase: 'http://api.lk2020.be'
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
  searchModes: {},
  testing: {
    removeDataCyAttributes: false
  }
};
