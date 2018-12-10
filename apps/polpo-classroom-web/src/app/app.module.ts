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
import { AppComponent } from './app.component';
import { AppResolver } from './app.resolver';

@NgModule({
  declarations: [AppComponent],
  imports: [
    UiModule,
    BrowserModule,
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
    RouterModule.forRoot(
      [
        {
          path: '',
          resolve: { AppResolver },
          children: [
            {
              path: 'books',
              loadChildren: '@campus/pages/books#PagesBooksModule',
              //canLoad: [CoupledTeacherGuard],
              data: { breadcrumb: 'books' }
            },
            { path: 'dev', loadChildren: '@campus/devlib#DevlibModule' },
            {
              path: 'tasks',
              loadChildren: '@campus/pages/tasks#PagesTasksModule',
              //canLoad: [CoupledTeacherGuard]
              data: { breadcrumb: 'tasks' }
            },
            {
              path: 'reports',
              loadChildren: '@campus/pages/reports#PagesReportsModule',
              data: { breadcrumb: 'reports' }
            },
            {
              path: 'profile',
              loadChildren: '@campus/pages/profile#PagesProfileModule',
              data: { breadcrumb: 'books' }
            },
            {
              path: 'messages',
              loadChildren: '@campus/pages/messages#PagesMessagesModule',
              data: { breadcrumb: 'messages' }
            },
            {
              path: 'logout',
              loadChildren: '@campus/pages/logout#PagesLogoutModule'
            },
            {
              path: 'alerts',
              loadChildren: '@campus/pages/alerts#PagesAlertsModule',
              data: { breadcrumb: 'alerts' }
            },
            {
              path: '',
              redirectTo: 'bundles',
              pathMatch: 'full'
            },
            {
              path: 'bundles',
              loadChildren: '@campus/pages/bundles#PagesBundlesModule',
              //canLoad: [CoupledTeacherGuard]
              data: { breadcrumb: 'bundles' }
            }
          ]
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
