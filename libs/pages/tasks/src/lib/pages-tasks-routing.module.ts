import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksAreaComponent } from './components/tasks-area/tasks-area.component';
import { TasksResolver } from './components/tasks.resolver';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    component: TasksAreaComponent,
    resolve: { isResolved: TasksResolver }
  },
  {
    path: ':area',
    resolve: { isResolved: TasksResolver },
    children: [
      {
        path: '',
        component: TasksComponent
        // },
        // {
        //   path: ':task',
        //   children: [
        //     {
        //       path: '',
        //       component: TaskDetai
        //     }
        //   ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesTasksRoutingModule {}
