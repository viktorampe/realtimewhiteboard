import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodQueries } from '@campus/dal';
import { AllowedMethodGuard } from '@campus/guards';
import { ManagePracticeOverviewComponent } from './components/manage-practice-overview/manage-practice-overview.component';
import { PracticeMethodDetailComponent } from './components/practice-method-detail/practice-method-detail.component';
import { ManagePracticeResolver } from './resolvers/pages-manage-practice.resolver';
import { PracticeMethodDetailResolver } from './resolvers/pages-practice-method-detail.resolver';
import { PracticeOverviewResolver } from './resolvers/pages-practice-overview.resolver';

const routes: Routes = [
  {
    path: '',
    component: null
  },
  {
    path: 'manage',
    resolve: { isResolved: ManagePracticeResolver },
    runGuardsAndResolvers: 'always',
    data: { breadcrumbText: 'Beheren' },
    children: [
      {
        path: '',
        resolve: { isResolved: PracticeOverviewResolver },
        runGuardsAndResolvers: 'always',
        component: ManagePracticeOverviewComponent
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
