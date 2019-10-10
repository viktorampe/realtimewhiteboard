import { Injectable } from '@angular/core';
import { SettingsServiceInterface } from './settings.service.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements SettingsServiceInterface {
  public APIBase: string;
  public eduContentMetadataId: number;
  public eduContentId: number;
}
