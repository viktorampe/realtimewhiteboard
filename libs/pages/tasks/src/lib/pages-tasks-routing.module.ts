import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksAreaComponent } from './components/tasks-area/tasks-area.component';
import { TasksViewModel } from './components/tasks.viewmodel';

const routes: Routes = [
  {
    path: '',
    component: TasksAreaComponent,
    resolve: { isResolved: TasksViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesTasksRoutingModule {}
