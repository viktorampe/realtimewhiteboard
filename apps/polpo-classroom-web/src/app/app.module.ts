import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CustomSerializer, DalModule } from '@campus/dal';
import { GuardsModule } from '@campus/guards';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { EffectsModule } from '@ngrx/effects';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';
import { storeFreeze } from 'ngrx-store-freeze';
import { configureBufferSize, handleUndo } from 'ngrx-undo';
import { environment } from '../environments/environment';
import { AppEffects } from './+state/app.effects';
import {
  appReducer,
  initialState as appInitialState
} from './+state/app.reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  BrowserFaviconService,
  BrowserFaviconToken
} from './services/favicons';

// if you want to update the buffer (which defaults to 100)
configureBufferSize(150);

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
      environment.api,
      environment.sso
    ),
    BrowserAnimationsModule,
    NxModule.forRoot(),
    DalModule.forRoot({ apiBaseUrl: environment.api.APIBase }),
    GuardsModule,
    StoreModule.forRoot(
      { app: appReducer, router: routerReducer },
      {
        initialState: { app: appInitialState },
        metaReducers: !environment.production
          ? [storeFreeze, handleUndo]
          : [handleUndo]
      }
    ),
    EffectsModule.forRoot([AppEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
      serializer: CustomSerializer
    })
  ],
  providers: [
    Title,
    {
      provide: BrowserFaviconToken,
      useClass: BrowserFaviconService
    }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
