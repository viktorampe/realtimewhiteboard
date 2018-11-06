import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { TasksComponent } from './components/tasks.component';
import { TasksViewModel } from './components/tasks.viewmodel';
import { PagesTasksRoutingModule } from './pages-tasks-routing.module';

@NgModule({
  imports: [CommonModule, PagesTasksRoutingModule, UiModule, SharedModule],
  declarations: [TasksComponent],
  providers: [TasksViewModel]
})
export class PagesTasksModule {}
