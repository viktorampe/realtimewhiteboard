import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningAreaQueries } from '@campus/dal';
import { OverviewAreaWithResultsComponent } from './components/overview-areas-with-results/overview-area-with-results.component';
import { ReportsResolver } from './components/reports.resolver';
import { ResultsByPersonAndAreaComponent } from './components/results-by-person-and-area/results-by-person-and-area.component';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: ReportsResolver },
    children: [
      {
        path: '',
        component: OverviewAreaWithResultsComponent
      },
      {
        path: ':area',
        data: {
          selector: LearningAreaQueries.getById,
          displayProperty: 'name'
        },
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
