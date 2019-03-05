import { EnvironmentInterface } from '@campus/shared';
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
  }
};
