import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';
import { storeFreeze } from 'ngrx-store-freeze';
import { configureBufferSize, handleUndo } from 'ngrx-undo';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

configureBufferSize(150);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UiModule,
    MatIconModule,
    SharedModule.forRoot(
      environment.features.alerts,
      environment.features.messages,
      environment.features.errorManagement,
      environment.iconMapping,
      environment.website,
      environment.logout,
      environment.login,
      environment.termPrivacy,
      environment.api,
      environment.sso,
      environment.searchModes,
      environment.testing
    ),
    NxModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    StoreModule.forRoot(
      { app: undefined, router: routerReducer },
      {
        metaReducers: !environment.production
          ? [storeFreeze, handleUndo]
          : [handleUndo]
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
