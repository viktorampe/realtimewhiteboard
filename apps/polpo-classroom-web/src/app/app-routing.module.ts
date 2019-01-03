import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard, CoupledTeacherGuard } from '@campus/guards';
import { AppResolver } from './app.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: AppResolver },
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'books',
        loadChildren: '@campus/pages/books#PagesBooksModule',
        data: { breadcrumbText: 'Boeken' },
        canActivate: [CoupledTeacherGuard]
      },
      {
        path: 'tasks',
        loadChildren: '@campus/pages/tasks#PagesTasksModule',
        data: { breadcrumbText: 'Taken' },
        canActivate: [CoupledTeacherGuard]
      },
      {
        path: 'reports',
        loadChildren: '@campus/pages/reports#PagesReportsModule',
        data: { breadcrumbText: 'Resultaten' },
        canActivate: [CoupledTeacherGuard]
      },
      {
        path: 'profile',
        loadChildren: '@campus/pages/profile#PagesProfileModule',
        data: { breadcrumbText: 'Mijn profiel' }
      },
      {
        path: 'messages',
        loadChildren: '@campus/pages/messages#PagesMessagesModule',
        data: { breadcrumbText: 'Berichten' }
      },
      {
        path: 'logout',
        loadChildren: '@campus/pages/logout#PagesLogoutModule'
      },
      {
        path: 'alerts',
        loadChildren: '@campus/pages/alerts#PagesAlertsModule',
        data: { breadcrumbText: 'Meldingen' }
      },
      {
        path: 'settings',
        data: { breadcrumbText: 'Instellingen' },
        children: [
          {
            path: 'dashboard',
            loadChildren:
              '@campus/pages/settings/dashboard#PagesSettingsDashboardModule',
            data: { breadcrumbText: 'Dashboard' }
          },
          {
            path: 'profile',
            loadChildren:
              '@campus/pages/settings/profile#PagesSettingsProfileModule',
            data: { breadcrumbText: 'Profiel' }
          },
          {
            path: 'credentials',
            loadChildren:
              '@campus/pages/settings/credentials#PagesSettingsCredentialsModule',
            data: { breadcrumbText: 'Inloggegevens' }
          },
          {
            path: 'coupled-teachers',
            loadChildren:
              '@campus/pages/settings/coupled-teachers#PagesSettingsCoupledTeachersModule',
            data: { breadcrumbText: 'Gekoppelde leerkrachten' }
          },
          {
            path: 'avatar',
            loadChildren:
              '@campus/pages/settings/avatar#PagesSettingsAvatarModule',
            data: { breadcrumbText: 'Avatar' }
          }
        ]
      },
      {
        path: '',
        redirectTo: 'bundles',
        pathMatch: 'full'
      },
      {
        path: 'bundles',
        loadChildren: '@campus/pages/bundles#PagesBundlesModule',
        data: { breadcrumbText: 'Bundels' },
        canActivate: [CoupledTeacherGuard]
      }
    ]
  },
  {
    path: 'login',
    redirectTo: 'dev/login'
  },
  {
    path: 'settings',
    redirectTo: 'dev/settings'
  },
  {
    path: 'error',
    redirectTo: 'dev'
  },
  {
    path: 'dev',
    loadChildren: '@campus/devlib#DevlibModule',
    data: { breadcrumbText: 'Full retard' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
