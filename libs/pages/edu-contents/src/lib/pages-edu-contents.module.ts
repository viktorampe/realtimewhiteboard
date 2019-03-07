import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { EduContentSearchModesComponent } from './components/edu-content-area/edu-contents-search-modes/edu-contents-search-modes.component';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents-learning-area-overview/edu-contents-learning-area-overview.component';
import { EduContentSearchByTermComponent } from './components/edu-contents-search-by-term/edu-contents-search-by-term.component';
import { EduContentsViewModel } from './components/edu-contents.viewmodel';
import { PagesEduContentsRoutingModule } from './pages-edu-contents-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesEduContentsRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [
    EduContentLearningAreaOverviewComponent,
    EduContentSearchByTermComponent,
    EduContentSearchModesComponent
  ],
  providers: [EduContentsViewModel]
})
export class PagesEduContentsModule {}
