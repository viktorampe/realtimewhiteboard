import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningAreaQueries, TaskQueries } from '@campus/dal';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TasksAreaComponent } from './components/tasks-area/tasks-area.component';
import { TasksResolver } from './components/tasks.resolver';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    resolve: { isResolved: TasksResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: TasksAreaComponent
      },
      {
        path: ':area',
        data: {
          selector: LearningAreaQueries.getById,
          displayProperty: 'name'
        },
        children: [
          {
            path: '',
            component: TasksComponent
          },
          {
            path: ':task',
            component: TaskDetailComponent,
            data: { selector: TaskQueries.getById, displayProperty: 'name' }
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
export class PagesTasksRoutingModule {}
