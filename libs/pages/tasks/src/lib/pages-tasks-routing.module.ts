import { TasksViewModel } from './components/tasks.viewmodel';

import { TasksComponent } from './components/tasks.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    resolve: { isResolved: TasksViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesTasksRoutingModule {}
