import { ReportsViewModel } from './components/reports.viewmodel';

import { ReportsComponent } from './components/reports.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    resolve: { isResolved: ReportsViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesReportsRoutingModule {}
