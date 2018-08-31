import { TasksViewModel } from './components/tasks.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesTasksRoutingModule } from './pages-tasks-routing.module';
import { TasksComponent } from './components/tasks.component';

@NgModule({
  imports: [CommonModule, PagesTasksRoutingModule],
  declarations: [TasksComponent],

  providers: [TasksViewModel]
})
export class PagesTasksModule {}
