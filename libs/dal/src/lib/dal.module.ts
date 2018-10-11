import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { EduContent } from './+state/edu-content';
import { EduContentsEffects } from './+state/edu-content/edu-content.effects';
import { EduContentService } from './edu-content/edu-content.service';
import { EDUCONTENT_SERVICE_TOKEN } from './edu-content/edu-content.service.interface';
import { AuthService, AuthServiceToken } from './persons/auth-service';

interface DalOptions {
  apiBaseUrl: string;
}

@NgModule({
  imports: [
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    StoreModule.forFeature('bundles', bundlesReducer, {
      initialState: bundlesInitialState
    }),
    StoreModule.forFeature('eduContent', EduContent.reducer, {
      initialState: EduContent.initialState
    }),
    EffectsModule.forFeature([BundlesEffects, EduContentsEffects])
  ],
  providers: [
    { provide: EDUCONTENT_SERVICE_TOKEN, useClass: EduContentService },
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
