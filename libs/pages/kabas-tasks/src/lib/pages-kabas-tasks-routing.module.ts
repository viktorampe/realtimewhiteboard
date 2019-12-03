import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageTasksOverviewComponent } from './components/manage-tasks-overview/manage-tasks-overview.component';

const routes: Routes = [
  {
    path: '',
    component: ManageTasksOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesKabasTasksRoutingModule {}
