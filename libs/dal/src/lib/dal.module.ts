import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthService, AuthServiceToken } from '@campus/dal';
import { SDKBrowserModule } from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BundlesEffects } from './+state/bundles/bundles.effects';
import {
  bundlesReducer,
  initialState as bundlesInitialState
} from './+state/bundles/bundles.reducer';
import { BundleService } from './bundle/bundle.service';
import { BUNDLE_SERVICE_TOKEN } from './bundle/bundle.service.interface';

@NgModule({
  imports: [
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    StoreModule.forFeature('bundles', bundlesReducer, {
      initialState: bundlesInitialState
    }),
    EffectsModule.forFeature([BundlesEffects])
  ]
})
export class DalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DalModule,
      providers: [
        { provide: AuthServiceToken, useClass: AuthService },
        { provide: BUNDLE_SERVICE_TOKEN, useClass: BundleService }
      ]
    };
  }
}
