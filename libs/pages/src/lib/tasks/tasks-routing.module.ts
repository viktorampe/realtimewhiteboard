import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './components/tasks.component';
import { TasksResolver } from './components/tasks.resolver';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    resolve: { isResolved: TasksResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TasksResolver]
})
export class TasksRoutingModule {}
