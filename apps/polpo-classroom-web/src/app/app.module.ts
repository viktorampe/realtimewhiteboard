import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { GuardsModule } from '@campus/guards';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../environments/environment';
import { AppEffects } from './+state/app.effects';
import {
  appReducer,
  initialState as appInitialState
} from './+state/app.reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    UiModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(
      environment.features.alerts,
      environment.features.messages,
      environment.features.errorManagement,
      environment.iconMapping,
      environment.website,
      environment.APIBase
    ),
    BrowserAnimationsModule,
    NxModule.forRoot(),
    DalModule.forRoot({ apiBaseUrl: environment.APIBase }),
    GuardsModule,
    StoreModule.forRoot(
      { app: appReducer },
      {
        initialState: { app: appInitialState },
        metaReducers: !environment.production ? [storeFreeze] : []
      }
    ),
    EffectsModule.forRoot([AppEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
