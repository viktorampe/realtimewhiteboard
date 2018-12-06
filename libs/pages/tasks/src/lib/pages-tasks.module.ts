import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { InfoPanelContentComponent } from './components/info-panel/info-panel-content/info-panel-content.component';
import { InfoPanelTaskComponent } from './components/info-panel/info-panel-task/info-panel-task.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TasksAreaComponent } from './components/tasks-area/tasks-area.component';
import { TasksViewModel } from './components/tasks.viewmodel';
import { TasksComponent } from './components/tasks/tasks.component';
import { PagesTasksRoutingModule } from './pages-tasks-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesTasksRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule,
    MatIconModule
  ],
  declarations: [
    TasksComponent,
    InfoPanelContentComponent,
    InfoPanelTaskComponent,
    TaskDetailComponent,
    TasksAreaComponent
  ],
  providers: [TasksViewModel]
})
export class PagesTasksModule {}
