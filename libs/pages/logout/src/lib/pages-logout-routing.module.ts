import { LogoutViewModel } from './components/logout.viewmodel';

import { LogoutComponent } from './components/logout.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LogoutComponent,
    resolve: { isResolved: LogoutViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesLogoutRoutingModule {}
