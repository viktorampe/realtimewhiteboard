import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NxModule } from '@nrwl/nx';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'bundles', pathMatch: 'full' },
        // { path: 'alerts', loadChildren: '@campus/pages/alerts#AlertsModule' },
        {
          path: 'bundles',
          loadChildren: '@campus/pages/bundles#PagesBundlesModule'
        }
        // { path: 'logout', loadChildren: '@campus/pages/logout#LogoutModule' },
        // {
        //   path: 'messages',
        //   loadChildren: '@campus/pages/messages#MessagesModule'
        // },
        // {
        //   path: 'profile',
        //   loadChildren: '@campus/pages/profile#ProfileModule'
        // },
        // {
        //   path: 'reports',
        //   loadChildren: '@campus/pages/reports#ReportsModule'
        // },
        // { path: 'tasks', loadChildren: '@campus/pages/tasks#TasksModule' }
      ],
      { initialNavigation: 'enabled', enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
