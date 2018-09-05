import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DalModule } from '@campus/dal';
import { NxModule } from '@nrwl/nx';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
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
      { initialNavigation: 'enabled', enableTracing: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
