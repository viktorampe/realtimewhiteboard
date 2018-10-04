import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports.component';
import { ReportsViewModel } from './components/reports.viewmodel';

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
