import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodQueries } from '@campus/dal';
import { AllowedMethodGuard } from '@campus/guards';
import { ManagePracticeMethodDetailComponent } from './components/manage-practice-method-detail/manage-practice-method-detail.component';
import { ManagePracticeOverviewComponent } from './components/manage-practice-overview/manage-practice-overview.component';
import { PracticeOverviewComponent } from './components/practice-overview/practice-overview.component';
import { ManagePracticeMethodDetailResolver } from './resolvers/pages-manage-practice-method-detail.resolver';
import { ManagePracticeOverviewResolver } from './resolvers/pages-manage-practice-overview.resolver';
import { ManagePracticeResolver } from './resolvers/pages-manage-practice.resolver';
import { PracticeBookChaptersResolver } from './resolvers/pages-practice-book-chapters.resolver';
import { PracticeResolver } from './resolvers/pages-practice.resolver';

const routes: Routes = [
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
            component: ManagePracticeMethodDetailComponent
          }
        ]
      }
    ]
  },
  {
    path: '',
    resolve: { isResolved: PracticeResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: PracticeOverviewComponent
      },
      {
        path: ':book',
        component: PracticeOverviewComponent, // TODO: change to new component
        resolve: { isResolved: PracticeBookChaptersResolver },
        data: {
          selector: MethodQueries.getMethodWithYearByBookId
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesPracticeRoutingModule {}
