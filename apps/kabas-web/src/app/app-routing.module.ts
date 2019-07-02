import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'dev/login'
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
