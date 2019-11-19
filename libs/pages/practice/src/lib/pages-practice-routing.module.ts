import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodQueries } from '@campus/dal';
import { AllowedMethodGuard } from '@campus/guards';
import { ManagePracticeOverviewComponent } from './components/manage-practice-overview/manage-practice-overview.component';
import { PracticeMethodDetailComponent } from './components/practice-method-detail/practice-method-detail.component';
import { PracticeOverviewComponent } from './components/practice-overview/practice-overview.component';
import { ManagePracticeMethodDetailResolver } from './resolvers/pages-manage-practice-method-detail.resolver';
import { ManagePracticeOverviewResolver } from './resolvers/pages-manage-practice-overview.resolver';
import { ManagePracticeResolver } from './resolvers/pages-manage-practice.resolver';

const routes: Routes = [
  {
    path: '',
    component: PracticeOverviewComponent
  },
  {
    path: 'manage',
    resolve: { isResolved: ManagePracticeResolver },
    runGuardsAndResolvers: 'always',
    data: { breadcrumbText: 'Beheren' },
    children: [
      {
        path: '',
        resolve: { isResolved: ManagePracticeOverviewResolver },
        runGuardsAndResolvers: 'always',
        component: ManagePracticeOverviewComponent
      },
      {
        path: ':book',
        resolve: { isResolved: ManagePracticeMethodDetailResolver },
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
