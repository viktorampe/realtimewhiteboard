import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatChipsModule,
  MatDialogModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SearchModule, SEARCH_RESULT_ITEM_UPDATER_TOKEN } from '@campus/search';
import {
  ContentTaskActionsService,
  CONTENT_OPENER_TOKEN,
  CONTENT_TASK_ACTIONS_SERVICE_TOKEN,
  CONTENT_TASK_MANAGER_TOKEN,
  SharedModule,
  STUDENT_TASK_OPENER_TOKEN,
  TaskActionsStudentService,
  TaskActionsTeacherService,
  TASK_ACTIONS_STUDENT_SERVICE_TOKEN,
  TASK_ACTIONS_TEACHER_SERVICE_TOKEN,
  TEACHER_TASK_OPENER_TOKEN
} from '@campus/shared';
import { ManageCollectionComponent, UiModule } from '@campus/ui';
import { UtilsModule } from '@campus/utils';
import { KabasTasksViewModel } from './components/kabas-tasks.viewmodel';
import { ManageKabasTasksAddAssigneesComponent } from './components/manage-kabas-tasks-add-assignees/manage-kabas-tasks-add-assignees.component';
import { ManageKabasTasksAssigneeModalComponent } from './components/manage-kabas-tasks-assignee-modal/manage-kabas-tasks-assignee-modal.component';
import { ManageKabasTasksDetailComponent } from './components/manage-kabas-tasks-detail/manage-kabas-tasks-detail.component';
import { ManageKabasTasksOverviewComponent } from './components/manage-kabas-tasks-overview/manage-kabas-tasks-overview.component';
import { ManageTaskContentComponent } from './components/manage-task-content/manage-task-content.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { PrintPaperTaskModalComponent } from './components/print-paper-task-modal/print-paper-task-modal.component';
import { StudentTaskContentListItemComponent } from './components/student-task-content-list-item/student-task-content-list-item.component';
import { StudentTaskDetailComponent } from './components/student-task-detail/student-task-detail.component';
import { StudentTaskListItemComponent } from './components/student-task-list-item/student-task-list-item.component';
import { StudentTaskOverviewComponent } from './components/student-task-overview/student-task-overview.component';
import { StudentTasksViewModel } from './components/student-tasks.viewmodel';
import { TaskEduContentListItemComponent } from './components/task-edu-content-list-item/task-edu-content-list-item.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';
import { PendingTaskGuard } from './guards/pending-task.guard';
import { ValidTaskInstanceGuard } from './guards/valid-task-instance.guard';
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
    DragDropModule,
    MatChipsModule
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
    PrintPaperTaskModalComponent,
    ManageTaskContentComponent,
    StudentTaskOverviewComponent,
    StudentTaskDetailComponent,
    StudentTaskListItemComponent,
    StudentTaskContentListItemComponent
  ],
  providers: [
    {
      provide: CONTENT_OPENER_TOKEN,
      useExisting: KabasTasksViewModel
    },
    {
      provide: CONTENT_TASK_MANAGER_TOKEN,
      useExisting: KabasTasksViewModel
    },
    {
      provide: TEACHER_TASK_OPENER_TOKEN,
      useExisting: KabasTasksViewModel
    },
    {
      provide: STUDENT_TASK_OPENER_TOKEN,
      useExisting: StudentTasksViewModel
    },
    {
      provide: SEARCH_RESULT_ITEM_UPDATER_TOKEN,
      useExisting: KabasTasksViewModel
    },
    {
      provide: CONTENT_TASK_ACTIONS_SERVICE_TOKEN,
      useClass: ContentTaskActionsService
    },
    {
      provide: TASK_ACTIONS_TEACHER_SERVICE_TOKEN,
      useClass: TaskActionsTeacherService
    },
    {
      provide: TASK_ACTIONS_STUDENT_SERVICE_TOKEN,
      useClass: TaskActionsStudentService
    },
    ValidTaskInstanceGuard,
    PendingTaskGuard
  ],
  exports: [],
  entryComponents: [
    ManageKabasTasksAssigneeModalComponent,
    NewTaskComponent,
    PrintPaperTaskModalComponent,
    ManageCollectionComponent
  ]
})
export class PagesKabasTasksModule {}
