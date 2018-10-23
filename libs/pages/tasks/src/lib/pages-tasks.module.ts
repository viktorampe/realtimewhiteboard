import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { TasksComponent } from './components/tasks.component';
import { TasksViewModel } from './components/tasks.viewmodel';
import { PagesTasksRoutingModule } from './pages-tasks-routing.module';

@NgModule({
  imports: [CommonModule, PagesTasksRoutingModule, UiModule, PagesSharedModule],
  declarations: [TasksComponent],

  providers: [TasksViewModel]
})
export class PagesTasksModule {}
