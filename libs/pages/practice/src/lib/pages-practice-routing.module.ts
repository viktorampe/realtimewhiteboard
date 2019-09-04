import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodQueries } from '@campus/dal';
import { AllowedMethodGuard } from '@campus/guards';
import { PracticeComponent } from './components/practice.component';
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
        component: PracticeComponent //Placeholder practice-overview
      },
      {
        path: ':book',
        resolve: { isResolved: PracticeMethodDetailResolver },
        canActivate: [AllowedMethodGuard],
        data: {
          selector: MethodQueries.getMethodWithYearByBookId
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: PracticeComponent //Placeholder practice-method-detail
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
