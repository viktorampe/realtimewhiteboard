export interface EnvironmentInterface {
  production: boolean;
  iconMapping: EnvironmentIconMappingInterface;
  website: EnvironmentWebsiteInterface;
  api: EnvironmentApiInterface;
  features: {
    alerts: EnvironmentAlertsFeatureInterface;
    messages: EnvironmentMessagesFeatureInterface;
    errorManagement: EnvironmentErrorManagementFeatureInterface;
  };
  sso: EnvironmentSsoInterface;
}

export interface EnvironmentIconMappingInterface {
  [icon: string]: string;
}

export interface EnvironmentAlertsFeatureInterface {
  enabled: boolean;
  hasAppBarDropDown: boolean;
  appBarPollingInterval: number;
}

export interface EnvironmentMessagesFeatureInterface {
  enabled: boolean;
  hasAppBarDropDown: boolean;
}

export interface EnvironmentErrorManagementFeatureInterface {
  managedStatusCodes: number[];
}

export interface EnvironmentWebsiteInterface {
  url: string;
}

export interface EnvironmentSsoInterface {
  [provider: string]: EnvironmentSsoProviderInterface;
}

export interface EnvironmentSsoProviderInterface {
  enabled: boolean;
  linkUrl: string;
  maxNumberAllowed: number;
  avatarLocation?: string;
  className?: string;
}

export interface EnvironmentWebsiteInterface {
  url: string;
}

export interface EnvironmentApiInterface {
  APIBase: string;
}
