import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
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
    SharedModule
  ],
  declarations: [TasksComponent, TasksAreaComponent],

  providers: [TasksViewModel],

  exports: [TasksAreaComponent]
})
export class PagesTasksModule {}
