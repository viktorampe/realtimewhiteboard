import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './components/alerts.component';
import { AlertsResolver } from './components/alerts.resolver';

const routes: Routes = [
  {
    path: '',
    component: AlertsComponent,
    resolve: { isResolved: AlertsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesAlertsRoutingModule {}
