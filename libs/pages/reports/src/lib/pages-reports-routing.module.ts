import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './components/reports.component';
import { ReportsResolver } from './components/reports.resolver';
import { ResultsByPersonAndAreaComponent } from './components/results-by-person-and-area/results-by-person-and-area.component';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: ReportsResolver },
    children: [
      {
        path: '',
        component: ReportsComponent
      },
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
