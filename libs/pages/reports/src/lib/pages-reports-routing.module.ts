import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports.component';
import { ReportsResolver } from './components/reports.resolver';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    resolve: { isResolved: ReportsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesReportsRoutingModule {}
