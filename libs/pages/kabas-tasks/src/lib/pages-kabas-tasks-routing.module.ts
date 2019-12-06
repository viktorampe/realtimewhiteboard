import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageKabasTasksOverviewComponent } from './components/manage-kabas-tasks-overview/manage-kabas-tasks-overview.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageKabasTasksOverviewComponent
    // runGuardsAndResolvers: 'always',
    // data: {
    //   requiredPermissions: 'manageTasks'
    // },
    // canActivate: [PermissionGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesKabasTasksRoutingModule {}
