import { InjectionToken } from '@angular/core';

export const SETTINGS_SERVICE_TOKEN = new InjectionToken('SettingsService');

export interface SettingsServiceInterface {
  APIBase: string;
  eduContentMetadataId: number;
  eduContentId: number;
}
