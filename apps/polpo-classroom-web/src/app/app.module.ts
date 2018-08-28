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
        { path: 'alerts', loadChildren: '@campus/pages#AlertsModule' },
        { path: 'bundles', loadChildren: '@campus/pages#BundlesModule' },
        { path: 'logout', loadChildren: '@campus/pages#LogoutModule' },
        { path: 'messages', loadChildren: '@campus/pages#MessagesModule' },
        { path: 'profile', loadChildren: '@campus/pages#ProfileModule' },
        { path: 'reports', loadChildren: '@campus/pages#ReportsModule' },
        { path: 'tasks', loadChildren: '@campus/pages#TasksModule' }
      ],
      { initialNavigation: 'enabled', enableTracing: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
