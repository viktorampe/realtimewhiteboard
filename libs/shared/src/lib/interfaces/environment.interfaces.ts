import { SearchModeInterface } from '@campus/search';

export interface EnvironmentInterface {
  production: boolean;
  iconMapping: EnvironmentIconMappingInterface;
  website: EnvironmentWebsiteInterface;
  logout: EnvironmentLogoutInterface;
  login: EnvironmentLoginInterface;
  termPrivacy: EnvironmentTermPrivacyInterface;
  api: EnvironmentApiInterface;
  features: {
    alerts: EnvironmentAlertsFeatureInterface;
    messages: EnvironmentMessagesFeatureInterface;
    errorManagement: EnvironmentErrorManagementFeatureInterface;
  };
  sso: EnvironmentSsoInterface;
  searchModes: EnvironmentSearchModesInterface;
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
  allowedErrors: EnvironmentErrorManagementFeatureAllowedErrorInterface[];
}

export interface EnvironmentErrorManagementFeatureAllowedErrorInterface {
  status?: number;
  name?: string;
  statusText?: string;
  urlRegex?: string;
  messageRegex?: string;
}

export interface EnvironmentWebsiteInterface {
  url: string;
  title: string;
  favicon: string;
}

export interface EnvironmentLogoutInterface {
  url: string;
}

export interface EnvironmentLoginInterface {
  url: string;
}

export interface EnvironmentTermPrivacyInterface {
  url: string;
}

export interface EnvironmentSsoInterface {
  [provider: string]: EnvironmentSsoProviderInterface;
}

export interface EnvironmentSsoProviderInterface {
  enabled: boolean;
  linkUrl: string;
  maxNumberAllowed?: number;
  className?: string;
  description?: string;
  logoIcon?: string;
}

export interface EnvironmentSearchModesInterface {
  [mode: string]: SearchModeInterface;
}

export interface EnvironmentWebsiteInterface {
  url: string;
}

export interface EnvironmentApiInterface {
  APIBase: string;
}
