import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskQueries } from '@campus/dal';
import { PermissionGuard } from '@campus/guards';
import { KabasTasksResolver } from './components/kabas-tasks.resolver';
import { ManageKabasTasksDetailComponent } from './components/manage-kabas-tasks-detail/manage-kabas-tasks-detail.component';
import { ManageKabasTasksOverviewComponent } from './components/manage-kabas-tasks-overview/manage-kabas-tasks-overview.component';
import { ManageTaskContentComponent } from './components/manage-task-content/manage-task-content.component';
import { StudentTaskDetailComponent } from './components/student-task-detail/student-task-detail.component';
import { StudentTaskOverviewComponent } from './components/student-task-overview/student-task-overview.component';
import { PendingTaskGuard } from './guards/pending-task.guard';

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
        path: 'new',
        runGuardsAndResolvers: 'always',
        component: ManageKabasTasksDetailComponent,
        data: {
          breadcrumbText: 'Nieuw'
        }
      },
      {
        path: ':id',
        runGuardsAndResolvers: 'always',
        data: {
          selector: TaskQueries.getById,
          displayProperty: 'name'
        },
        children: [
          {
            path: '',
            component: ManageKabasTasksDetailComponent
          },
          {
            path: 'content',
            component: ManageTaskContentComponent,
            runGuardsAndResolvers: 'always',
            canActivate: [PendingTaskGuard],
            data: {
              selector: undefined,
              displayProperty: undefined,
              breadcrumbText: 'Lesmateriaal toevoegen'
            }
          }
        ]
      }
    ]
  },
  {
    path: '',
    children: [
      { path: '', component: StudentTaskOverviewComponent },
      {
        path: ':id',
        children: [{ path: '', component: StudentTaskDetailComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesKabasTasksRoutingModule {}
