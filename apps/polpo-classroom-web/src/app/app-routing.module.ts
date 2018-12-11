import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@campus/guards';
import { AppResolver } from './app.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { AppResolver },
    canActivateChild: [AuthenticationGuard],
    children: [
      {
        path: 'books',
        loadChildren: '@campus/pages/books#PagesBooksModule'
        //canLoad: [CoupledTeacherGuard]
      },
      {
        path: 'tasks',
        loadChildren: '@campus/pages/tasks#PagesTasksModule'
        //canLoad: [CoupledTeacherGuard]
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
      {
        path: '',
        redirectTo: 'bundles',
        pathMatch: 'full'
      },
      {
        path: 'bundles',
        loadChildren: '@campus/pages/bundles#PagesBundlesModule'
        //canLoad: [CoupledTeacherGuard]
      }
    ]
  },
  {
    path: 'login',
    redirectTo: 'dev'
  },
  {
    path: 'error/401',
    redirectTo: 'dev'
  },
  { path: 'dev', loadChildren: '@campus/devlib#DevlibModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
