import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
        { path: 'login', loadChildren: '@campus/devlib#DevlibModule' },
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
    )
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
