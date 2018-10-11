import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  BrowserModule as CampusBrowserModule,
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageService
} from '@campus/browser';
import {
  LoopBackConfig,
  SDKBrowserModule
} from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UiEffects } from './+state/ui/ui.effects';
import {
  initialState as uiInitialState,
  uiReducer
} from './+state/ui/ui.reducer';
import {
  BundlesService,
  BUNDLES_SERVICE_TOKEN,
  UnlockedContentsService,
  UNLOCKEDCONTENTS_SERVICE_TOKEN
} from './bundles';
import { EduContentService } from './educontent/edu-content.service';
import { EDUCONTENT_SERVICE_TOKEN } from './educontent/edu-content.service.interface';
import { AuthService, AuthServiceToken } from './persons/auth-service';

interface DalOptions {
  apiBaseUrl: string;
}

@NgModule({
  imports: [
    CampusBrowserModule,
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    StoreModule.forFeature('ui', uiReducer, {
      initialState: uiInitialState
    }),
    EffectsModule.forFeature([UiEffects])
  ],
  providers: [
    { provide: EDUCONTENT_SERVICE_TOKEN, useClass: EduContentService },
    { provide: BUNDLES_SERVICE_TOKEN, useClass: BundlesService },
    {
      provide: UNLOCKEDCONTENTS_SERVICE_TOKEN,
      useClass: UnlockedContentsService
    },
    { provide: BROWSER_STORAGE_SERVICE_TOKEN, useClass: StorageService },
    { provide: AuthServiceToken, useClass: AuthService }
  ]
})
export class DalModule {
  constructor() {}
  static forRoot(options: DalOptions): ModuleWithProviders {
    LoopBackConfig.setBaseURL(options.apiBaseUrl);
    LoopBackConfig.setRequestOptionsCredentials(true);
    return {
      ngModule: DalModule
    };
  }
}
