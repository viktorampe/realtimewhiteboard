export const environment = {
  production: true,
  // promo website settings
  website: {
    url: 'https://www.staging.polpo.be'
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
