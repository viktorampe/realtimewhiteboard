import { FavoriteTypesEnum } from '@campus/dal';
import { icons } from './icons';
import { searchModes } from './search-modes';

export const environment = {
  production: true,
  iconMapping: icons,
  website: {
    url: 'https://www.lk2020.be',
    title: 'KABAS',
    favicon: 'assets/icons/favicon.ico'
  },
  logout: {
    url: 'https://www.lk2020.be'
  },
  login: {
    url: 'https://www.lk2020.be'
  },
  termPrivacy: {
    url: 'https://www.lk2020.be'
  },
  api: {
    APIBase: 'https://api.lk2020.be'
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
    removeDataCyAttributes: true
  },
  ui: {
    useNavItemStyle: true,
    useInfoPanelStyle: false
  }
};
