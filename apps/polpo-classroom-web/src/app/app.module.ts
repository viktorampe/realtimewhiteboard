import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
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
import { AppComponent } from './app.component';
import { UiModule } from '@campus/ui';

@NgModule({
  declarations: [AppComponent],
  imports: [
    UiModule,
    BrowserModule,
    BrowserAnimationsModule,
    NxModule.forRoot(),
    DalModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: 'tasks',
          loadChildren: '@campus/pages/tasks#PagesTasksModule'
        },

        {
          path: 'reports',
          loadChildren: '@campus/pages/reports#PagesReportsModule'
        },

        {
          path: 'profile',
          loadChildren: '@campus/pages/profile#PagesProfileModule'
        },

        {
          path: 'messages',
          loadChildren: '@campus/pages/messages#PagesMessagesModule'
        },

        {
          path: 'logout',
          loadChildren: '@campus/pages/logout#PagesLogoutModule'
        },

        {
          path: 'alerts',
          loadChildren: '@campus/pages/alerts#PagesAlertsModule'
        },

        { path: '', redirectTo: 'bundles', pathMatch: 'full' },
        {
          path: 'bundles',
          loadChildren: '@campus/pages/bundles#PagesBundlesModule'
        }
      ],
      { initialNavigation: 'enabled', enableTracing: false }
    ),
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
