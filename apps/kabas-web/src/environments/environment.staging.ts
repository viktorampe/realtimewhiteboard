import { FavoriteTypesEnum } from '@campus/dal';
import { icons } from './icons';
import { searchModes } from './search-modes';

export const environment = {
  production: true,
  iconMapping: icons,
  website: {
    url: 'http://www.kabas.localhost:3020/login',
    title: 'KABAS',
    favicon: 'assets/icons/favicon.ico'
  },
  logout: {
    url: 'http://www.kabas.localhost:3020/logout'
  },
  login: {
    url: 'http://www.kabas.localhost:3020/login',
    loginPresets: [
      { label: 'Student', username: 'student1', password: 'testje' },
      { label: 'Leerkracht', username: 'teacher1', password: 'testje' }
    ]
  },
  termPrivacy: {
    url: 'http://www.kabas.localhost:3020'
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
      managedStatusCodes: [500, 401, 404, 0],
      allowedErrors: [
        {
          status: 404,
          statusText: 'Not Found',
          urlRegex: 'http.*assets\\/icons.*.svg'
        },
        {
          // if login page get's HTTP 401, it handles error on the login page
          status: 401,
          urlRegex: 'http.*\\/People/login*'
        }
      ]
    },
    globalSearch: {
      enabled: true
    },
    favorites: {
      allowedFavoriteTypes: [
        FavoriteTypesEnum.BOEKE,
        FavoriteTypesEnum.TASK,
        FavoriteTypesEnum.EDUCONTENT
      ]
    }
  },
  sso: {},
  searchModes: searchModes,
  testing: {
    removeDataCyAttributes: false
  },
  ui: {
    useNavItemStyle: true,
    useInfoPanelStyle: false
  }
};
