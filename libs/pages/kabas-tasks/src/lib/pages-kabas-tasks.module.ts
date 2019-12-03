import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { ManageTasksOverviewComponent } from './components/manage-tasks-overview/manage-tasks-overview.component';
import { PagesKabasTasksRoutingModule } from './pages-kabas-tasks-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesKabasTasksRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [ManageTasksOverviewComponent],
  providers: [],
  exports: []
})
export class PagesKabasTasksModule {}
