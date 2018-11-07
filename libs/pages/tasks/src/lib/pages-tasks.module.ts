import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { InfoPanelTaskComponent } from './components/info-panel/info-panel-task/info-panel-task.component';
import { TasksComponent } from './components/tasks.component';
import { TasksViewModel } from './components/tasks.viewmodel';
import { PagesTasksRoutingModule } from './pages-tasks-routing.module';

@NgModule({
  imports: [CommonModule, PagesTasksRoutingModule, UiModule],
  declarations: [TasksComponent, InfoPanelTaskComponent],
  providers: [TasksViewModel]
})
export class PagesTasksModule {}
