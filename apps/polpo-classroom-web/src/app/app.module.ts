import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { NxModule } from '@nrwl/nx';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  initialState as appInitialState,
  appReducer
} from './+state/app.reducer';
import { AppEffects } from './+state/app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { UiModule } from '@campus/ui';

@NgModule({
  declarations: [AppComponent],
  imports: [
    UiModule,
    BrowserModule,
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
      { initialNavigation: 'enabled', enableTracing: true }
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
