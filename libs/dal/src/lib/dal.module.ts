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
import { BundlesEffects } from './+state/bundles/bundles.effects';
import {
  bundlesReducer,
  initialState as bundlesInitialState
} from './+state/bundles/bundles.reducer';
import { UiEffects } from './+state/ui/ui.effects';
import {
  initialState as uiInitialState,
  uiReducer
} from './+state/ui/ui.reducer';
import { BundleService } from './bundle/bundle.service';
import { BUNDLE_SERVICE_TOKEN } from './bundle/bundle.service.interface';
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
    StoreModule.forFeature('bundles', bundlesReducer, {
      initialState: bundlesInitialState
    }),
    StoreModule.forFeature('ui', uiReducer, {
      initialState: uiInitialState
    }),
    EffectsModule.forFeature([BundlesEffects, UiEffects])
  ],
  providers: [
    { provide: EDUCONTENT_SERVICE_TOKEN, useClass: EduContentService },
    { provide: BUNDLE_SERVICE_TOKEN, useClass: BundleService },
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
