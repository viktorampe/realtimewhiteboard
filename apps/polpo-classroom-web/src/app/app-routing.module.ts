import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permissions } from '@campus/dal';
import {
  AuthenticationGuard,
  CoupledTeacherGuard,
  PermissionGuard,
  TermPrivacyGuard
} from '@campus/guards';
import { AppResolver } from './app.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: AppResolver },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthenticationGuard, TermPrivacyGuard],
    children: [
      {
        path: 'books',
        loadChildren: '@campus/pages/books#PagesBooksModule',
        data: { breadcrumbText: 'Boeken' },
        canActivate: [CoupledTeacherGuard, PermissionGuard]
      },
      {
        path: 'edu-content',
        loadChildren: '@campus/pages/edu-contents#PagesEduContentsModule',
        data: { breadcrumbText: 'Lesmateriaal' },
        canActivate: [PermissionGuard]
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
        path: 'messages',
        loadChildren: '@campus/pages/messages#PagesMessagesModule',
        data: { breadcrumbText: 'Berichten' }
      },
      {
        path: 'logout',
        loadChildren: '@campus/pages/logout#PagesLogoutModule'
      },
      {
        path: 'settings',
        data: { breadcrumbText: 'Instellingen' },
        children: [
          {
            path: '',
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
            path: 'alerts',
            loadChildren:
              '@campus/pages/settings/alerts#PagesSettingsAlertsModule',
            data: { breadcrumbText: 'Meldingen' }
          },
          {
            path: 'coupled-teachers',
            loadChildren:
              '@campus/pages/settings/coupled-teachers#PagesSettingsCoupledTeachersModule',
            data: {
              breadcrumbText: 'Gekoppelde leerkrachten',
              requiredPermissions: [
                Permissions.settings.LINK_TEACHERS,
                Permissions.settings.UNLINK_TEACHERS
              ]
            },
            canActivate: [PermissionGuard]
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
    loadChildren: '@campus/pages/login#PagesLoginModule',
    data: { breadcrumbText: 'Login' }
  },
  {
    path: 'error',
    loadChildren: '@campus/pages/error#PagesErrorModule',
    data: {
      breadcrumbText: 'Foutmelding'
    }
  },
  {
    path: 'dev',
    loadChildren: '@campus/devlib#DevlibModule',
    data: { breadcrumbText: 'Full retard' }
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
