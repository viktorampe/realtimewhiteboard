import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskQueries } from '@campus/dal';
import { PermissionGuard } from '@campus/guards';
import { KabasTasksResolver } from './components/kabas-tasks.resolver';
import { ManageKabasTasksDetailComponent } from './components/manage-kabas-tasks-detail/manage-kabas-tasks-detail.component';
import { ManageKabasTasksOverviewComponent } from './components/manage-kabas-tasks-overview/manage-kabas-tasks-overview.component';

const routes: Routes = [
  {
    path: 'manage',
    resolve: { isResolved: KabasTasksResolver },
    runGuardsAndResolvers: 'always',
    data: {
      requiredPermissions: 'manageTasks',
      breadcrumbText: 'Beheren'
    },
    canActivate: [PermissionGuard],
    children: [
      {
        path: '',
        runGuardsAndResolvers: 'always',
        component: ManageKabasTasksOverviewComponent
      },
      {
        path: ':id',
        component: ManageKabasTasksDetailComponent,
        data: {
          selector: TaskQueries.getById,
          displayProperty: 'name'
        }
      }
    ]
  },
  {
    path: '',
    redirectTo: 'manage',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesKabasTasksRoutingModule {}
