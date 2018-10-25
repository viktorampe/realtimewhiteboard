import { InjectionToken } from '@angular/core';

export const ENVIRONMENT_FEATURES_TOKEN = new InjectionToken(
  'environmentFeatures'
);

export interface EnvironmentFeaturesInterface {
  alerts: {
    enabled: boolean;
    hasAppBarDropDown: boolean;
    appBarPollingInterval: number;
  };
  messages: {
    enabled: boolean;
    hasAppBarDropDown: boolean;
  };
}
