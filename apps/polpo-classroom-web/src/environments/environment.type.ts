export interface EnvironmentInterface {
  production: boolean;
  iconMapping: { [icon: string]: string };
  website: {
    url: string;
  };
  APIBase: string;
  features: {
    alerts: {
      enabled: boolean;
      hasAppBarDropDown: boolean;
      appBarPollingInterval: 3000;
    };
    messages: {
      enabled: boolean;
      hasAppBarDropDown: boolean;
    };
    errorManagement: {
      managedStatusCodes: number[];
    };
  };
  sso: {
    [provider: string]: {
      enabled: boolean;
      linkUrl: string;
      avatarLocation?: string;
    };
  };
}
