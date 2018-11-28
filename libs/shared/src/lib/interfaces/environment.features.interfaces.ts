import { InjectionToken } from '@angular/core';

export const ENVIRONMENT_ALERTS_FEATURE_TOKEN = new InjectionToken(
  'environmentAlertsFeature'
);

export interface EnvironmentAlertsFeatureInterface {
  enabled: boolean;
  hasAppBarDropDown: boolean;
}

export const ENVIRONMENT_MESSAGES_FEATURE_TOKEN = new InjectionToken(
  'environmentMessagesFeature'
);

export interface EnvironmentMessagesFeatureInterface {
  enabled: boolean;
  hasAppBarDropDown: boolean;
}

export const ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN = new InjectionToken(
  'environmentErrorManagementFeature'
);

export interface EnvironmentErrorManagementFeatureInterface {
  managedStatusCodes: number[];
}
