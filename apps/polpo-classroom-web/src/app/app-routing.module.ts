import { Component, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes
} from '@angular/router';
import { Permissions } from '@campus/dal';
import {
  AuthenticationGuard,
  CoupledTeacherGuard,
  PermissionGuard
} from '@campus/guards';
import { AppResolver } from './app.resolver';

@Component({
  selector: 'campus-not-found',
  template: '<div></div>'
})
export class NotFoundComponent {
  name = 'Angular';
}

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: AppResolver },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'books',
        loadChildren: '@campus/pages/books#PagesBooksModule',
        data: { breadcrumbText: 'Boeken' },
        canActivate: [CoupledTeacherGuard, PermissionGuard]
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
    redirectTo: 'dev/login'
  },
  {
    path: 'error',
    redirectTo: 'dev'
  },
  {
    path: 'dev',
    loadChildren: '@campus/devlib#DevlibModule',
    data: { breadcrumbText: 'Full retard' }
  },
  {
    path: '**',
    component: NotFoundComponent,
    resolve: {
      url: 'externalUrlRedirectResolver'
    },
    data: {
      externalUrl: ''
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule, NotFoundComponent],
  declarations: [NotFoundComponent],
  providers: [
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        let externalLink = false;
        let path = '';
        route.url.map(item => {
          if (!externalLink) {
            if (item.path.toLowerCase().includes('http')) {
              path = item.path + '//';
              externalLink = true;
            }
          } else {
            path += item.path + '/';
          }
        });
        if (externalLink) {
          console.log(path);
          window.open(path, '_blank');
        }
      }
    }
  ]
})
export class AppRoutingModule {}
