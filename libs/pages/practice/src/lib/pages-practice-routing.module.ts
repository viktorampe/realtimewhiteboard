import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodQueries } from '@campus/dal';
import { PracticeMethodDetailComponent } from './components/practice-method-detail/practice-method-detail.component';
import { PracticeOverviewComponent } from './components/practice-overview/practice-overview.component';
import { PracticeMethodDetailResolver } from './resolvers/pages-practice-method-detail.resolver';
import { PracticeOverviewResolver } from './resolvers/pages-practice-overview.resolver';
import { PracticeResolver } from './resolvers/pages-practice.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: PracticeResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        resolve: { isResolved: PracticeOverviewResolver },
        runGuardsAndResolvers: 'always',
        component: PracticeOverviewComponent
      },
      {
        path: ':book',
        resolve: { isResolved: PracticeMethodDetailResolver },
        canActivate: [],
        data: {
          selector: MethodQueries.getMethodWithYearByBookId
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: PracticeMethodDetailComponent
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
export class PagesPracticeRoutingModule {}
