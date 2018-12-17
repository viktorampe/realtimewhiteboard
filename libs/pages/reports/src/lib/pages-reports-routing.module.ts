import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewAreaWithResultsComponent } from './components/overview-areas-with-results/overview-area-with-results.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewAreaWithResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesReportsRoutingModule {}
