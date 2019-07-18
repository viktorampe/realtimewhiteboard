import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'error/999',
    pathMatch: 'full'
  },
  {
    path: 'methods',
    loadChildren: '@campus/pages/methods#PagesMethodsModule'
  },
  {
    path: 'search',
    loadChildren: '@campus/pages/global-search#PagesGlobalSearchModule'
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
