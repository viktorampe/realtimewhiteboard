import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthService, AuthServiceToken } from '@campus/dal';
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
import { UserEffects } from './+state/user/user.effects';
import {
  initialUserstate as userInitialState,
  userReducer
} from './+state/user/user.reducer';

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
    EffectsModule.forFeature([BundlesEffects, UserEffects]),
    StoreModule.forFeature('user', userReducer, {
      initialState: userInitialState
    })
  ]
})
export class DalModule {
  constructor() {}
  static forRoot(options: DalOptions): ModuleWithProviders {
    LoopBackConfig.setBaseURL(options.apiBaseUrl);
    LoopBackConfig.setRequestOptionsCredentials(true);
    return {
      ngModule: DalModule,
      providers: [{ provide: AuthServiceToken, useClass: AuthService }]
    };
  }
}
