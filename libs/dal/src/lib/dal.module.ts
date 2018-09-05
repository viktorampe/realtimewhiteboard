import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthService, AuthServiceToken } from '@campus/dal';
import { SDKBrowserModule } from '@diekeure/polpo-api-angular-sdk';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  initialState as bundlesInitialState,
  bundlesReducer
} from './+state/bundles/bundles.reducer';
import { BundlesEffects } from './+state/bundles/bundles.effects';

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
      providers: [{ provide: AuthServiceToken, useClass: AuthService }]
    };
  }
}
