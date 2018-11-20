import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TasksComponent } from './components/tasks.component';
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
