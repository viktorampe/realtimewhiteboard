import { SearchStateInterface } from '@campus/dal';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import {
  BrowserModule as CampusBrowserModule,
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageService
} from '@campus/browser';
import { ScormModule } from '@campus/scorm';
import {
  LoopBackConfig,
  SDKBrowserModule
} from '@diekeure/polpo-api-angular-sdk';
import { v4 as uuid } from 'uuid';

interface DalOptions {
  apiBaseUrl: string;
}
export const DAL_OPTIONS = new InjectionToken('dal-options');

@NgModule({
  imports: [
    CampusBrowserModule,
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    ScormModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: 'uuid',
      useValue: uuid
    },
    { provide: BROWSER_STORAGE_SERVICE_TOKEN, useClass: StorageService }
  ]
})
export class DalModule {
  constructor(@Inject(DAL_OPTIONS) options) {
    LoopBackConfig.setBaseURL(options.apiBaseUrl);
    LoopBackConfig.setRequestOptionsCredentials(true);
  }
  static forRoot(options: DalOptions): ModuleWithProviders {
    return {
      ngModule: DalModule,
      providers: [
        {
          provide: DAL_OPTIONS,
          useValue: options
        }
      ]
    };
  }
}
