import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewAreaWithResultsComponent } from './components/overview-areas-with-results/overview-area-with-results.component';
import { ReportsResolver } from './components/reports.resolver';

const routes: Routes = [
  {
    path: '',
    component: OverviewAreaWithResultsComponent,
    resolve: { isResolved: ReportsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesReportsRoutingModule {}
