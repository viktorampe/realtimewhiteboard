import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './components/tasks.component';
import { TasksResolver } from './components/tasks.resolver';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent, //TODO: terugzetten op TasksAreaComponent
    resolve: { isResolved: TasksResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesTasksRoutingModule {}
