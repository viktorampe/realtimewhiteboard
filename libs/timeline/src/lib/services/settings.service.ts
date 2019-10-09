import { Injectable, InjectionToken } from '@angular/core';

export const SETTINGS_SERVICE_TOKEN = new InjectionToken('SettingsService');

@Injectable()
export class SettingsService {
  public APIBase: string;
  public eduContentMetadataId: number;
  public eduContentId: number;
}
