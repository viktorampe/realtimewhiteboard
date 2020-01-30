import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SearchModule } from '@campus/search';
import { CONTENT_OPENER_TOKEN, SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { UtilsModule } from '@campus/utils';
import { KabasTasksViewModel } from './components/kabas-tasks.viewmodel';
import { ManageKabasTasksAddAssigneesComponent } from './components/manage-kabas-tasks-add-assignees/manage-kabas-tasks-add-assignees.component';
import { ManageKabasTasksAssigneeModalComponent } from './components/manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-modal.component';
import { ManageKabasTasksDetailComponent } from './components/manage-kabas-tasks-detail/manage-kabas-tasks-detail.component';
import { ManageKabasTasksOverviewComponent } from './components/manage-kabas-tasks-overview/manage-kabas-tasks-overview.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { PrintPaperTaskModalComponent } from './components/print-paper-task-modal/print-paper-task-modal.component';
import { TaskEduContentListItemComponent } from './components/task-edu-content-list-item/task-edu-content-list-item.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';
import { PagesKabasTasksRoutingModule } from './pages-kabas-tasks-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesKabasTasksRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule,
    GuardsModule,
    UtilsModule,
    MatSelectModule,
    SearchModule,
    GuardsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  declarations: [
    ManageKabasTasksOverviewComponent,
    TaskListItemComponent,
    TaskEduContentListItemComponent,
    ManageKabasTasksDetailComponent,
    ManageKabasTasksAssigneeModalComponent,
    ManageKabasTasksAddAssigneesComponent,
    NewTaskComponent,
    TaskEduContentListItemComponent,
    PrintPaperTaskModalComponent
  ],
  providers: [
    {
      provide: CONTENT_OPENER_TOKEN,
      useClass: KabasTasksViewModel
    }
  ],
  exports: [ManageKabasTasksAssigneeModalComponent],
  entryComponents: [
    ManageKabasTasksAssigneeModalComponent,
    NewTaskComponent,
    PrintPaperTaskModalComponent
  ]
})
export class PagesKabasTasksModule {}
