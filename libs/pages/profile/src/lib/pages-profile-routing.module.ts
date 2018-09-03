import { ProfileViewModel } from './components/profile.viewmodel';

import { ProfileComponent } from './components/profile.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: { isResolved: ProfileViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesProfileRoutingModule {}
