import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SearchModule } from '@campus/search';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { ManageKabasTasksOverviewComponent } from './components/manage-kabas-tasks-overview/manage-kabas-tasks-overview.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';
import { PagesKabasTasksRoutingModule } from './pages-kabas-tasks-routing.module';
@NgModule({
  imports: [
    CommonModule,
    PagesKabasTasksRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule,
    MatSelectModule,
    SearchModule,
    GuardsModule,
    MatSlideToggleModule
  ],
  declarations: [ManageKabasTasksOverviewComponent, TaskListItemComponent],
  providers: [],
  exports: []
})
export class PagesKabasTasksModule {}
