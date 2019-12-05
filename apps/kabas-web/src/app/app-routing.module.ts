import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard, TermPrivacyGuard } from '@campus/guards';
import { AppResolver } from './app.resolver';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthenticationGuard, TermPrivacyGuard],
    resolve: { isResolved: AppResolver },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: '@campus/pages/home#PagesHomeModule',
        data: { breadcrumbText: 'Home' }
      },
      {
        path: 'methods',
        loadChildren: '@campus/pages/methods#PagesMethodsModule',
        data: { breadcrumbText: 'Methodes' }
      },
      {
        path: 'tasks',
        loadChildren: '@campus/pages/kabas-tasks#PagesKabasTasksModule',
        data: { breadcrumbText: 'Taken' }
      },
      {
        path: 'practice',
        loadChildren: '@campus/pages/practice#PagesPracticeModule',
        data: { breadcrumbText: 'Vrij oefenen' }
      },
      {
        path: 'search',
        loadChildren: '@campus/pages/global-search#PagesGlobalSearchModule',
        data: {
          breadcrumbText: 'Zoekresultaten'
        }
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
          }
        ]
      }
    ]
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
    data: { breadcrumbText: 'Devlib' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
