import { AlertsViewModel } from './components/alerts.viewmodel';

import { AlertsComponent } from './components/alerts.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AlertsComponent,
    resolve: { isResolved: AlertsViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesAlertsRoutingModule {}
