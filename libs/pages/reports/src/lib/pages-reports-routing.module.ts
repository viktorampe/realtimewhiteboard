import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewAreaWithResultsComponent } from './components/overview-areas-with-results/overview-area-with-results.component';
import { ReportsResolver } from './components/reports.resolver';
import { ResultsByPersonAndAreaComponent } from './components/results-by-person-and-area/results-by-person-and-area.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewAreaWithResultsComponent,
    resolve: { isResolved: ReportsResolver },
    children: [
      {
        path: ':area',
        children: [
          {
            path: '',
            component: ResultsByPersonAndAreaComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesReportsRoutingModule {}
