import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksAreaComponent } from './components/tasks-area/tasks-area.component';

const routes: Routes = [
  {
    path: '',
    component: TasksAreaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesTasksRoutingModule {}
