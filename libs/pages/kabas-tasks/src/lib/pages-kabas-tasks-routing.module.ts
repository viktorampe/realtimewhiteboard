import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from '@campus/guards';
import { KabasTasksResolver } from './components/kabas-tasks.resolver';
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
