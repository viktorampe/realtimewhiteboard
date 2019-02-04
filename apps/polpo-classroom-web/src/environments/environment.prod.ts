export const environment = {
  production: true,
  // promo website settings
  website: {
    url: 'https://www.polpo.be'
  },
  logout: {
    url: 'https://www.polpo.be/identificatie/start'
  },
  features: {
    alerts: {
      enabled: true,
      hasAppBarDropDown: true,
      appBarPollingInterval: 30000
    },
    messages: {
      enabled: true,
      hasAppBarDropDown: true
    },
    errorManagement: {
      managedStatusCodes: [500, 401, 404]
    }
  }
};
