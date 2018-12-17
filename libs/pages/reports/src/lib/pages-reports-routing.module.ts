import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverViewAreaWithResultsComponent } from './components/overview-areas-with-results/overview-area-with-results.component';

const routes: Routes = [
  {
    path: '',
    component: OverViewAreaWithResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesReportsRoutingModule {}
