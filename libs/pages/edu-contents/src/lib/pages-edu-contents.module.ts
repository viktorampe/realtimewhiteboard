import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { EduContentSearchByTermComponent } from './components/edu-contents-search-by-term/edu-contents-search-by-term.component';
import { EduContentsViewModel } from './components/edu-contents.viewmodel';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents/edu-contents.component';
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
    EduContentSearchByTermComponent
  ],
  providers: [EduContentsViewModel]
})
export class PagesEduContentsModule {}
