import { InjectionToken } from '@angular/core';

export interface EnvironmentCollectionManagementFeatureInterface {
  useFilter?: boolean;
}

export const ENVIRONMENT_COLLECTION_MANAGEMENT_FEATURE_TOKEN = new InjectionToken(
  'environmentCollectionManagementFeature'
);
