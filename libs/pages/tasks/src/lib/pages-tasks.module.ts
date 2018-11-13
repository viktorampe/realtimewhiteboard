import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { InfoPanelContentComponent } from './components/info-panel/info-panel-content/info-panel-content.component';
import { InfoPanelTaskComponent } from './components/info-panel/info-panel-task/info-panel-task.component';
import { TasksComponent } from './components/tasks.component';
import { TasksViewModel } from './components/tasks.viewmodel';
import { PagesTasksRoutingModule } from './pages-tasks-routing.module';

@NgModule({
  imports: [CommonModule, PagesTasksRoutingModule, UiModule],
  declarations: [
    TasksComponent,
    InfoPanelTaskComponent,
    InfoPanelContentComponent
  ],
  providers: [TasksViewModel]
})
export class PagesTasksModule {}
