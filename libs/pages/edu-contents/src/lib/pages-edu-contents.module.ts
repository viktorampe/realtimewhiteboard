import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { SearchModule } from '@campus/search';
import { UiModule } from '@campus/ui';
import { EduContentLearningAreaOverviewComponent } from './components/edu-contents-learning-area-overview/edu-contents-learning-area-overview.component';
import { EduContentSearchByColumnComponent } from './components/edu-contents-search-by-column/edu-contents-search-by-column.component';
import { EduContentSearchByTermComponent } from './components/edu-contents-search-by-term/edu-contents-search-by-term.component';
import { EduContentSearchModesComponent } from './components/edu-contents-search-modes/edu-contents-search-modes.component';
import { EduContentsViewModel } from './components/edu-contents.viewmodel';
import { FavoriteAreasComponent } from './components/favorite-areas/favorite-areas.component';
import { PagesEduContentsRoutingModule } from './pages-edu-contents-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesEduContentsRoutingModule,
    UiModule,
    PagesSharedModule,
    SearchModule
  ],
  declarations: [
    EduContentLearningAreaOverviewComponent,
    EduContentSearchByTermComponent,
    EduContentSearchModesComponent,
    EduContentSearchByColumnComponent,
    FavoriteAreasComponent
  ],
  exports: [
    EduContentSearchByTermComponent,
    EduContentSearchModesComponent,
    EduContentSearchByColumnComponent
  ],
  providers: [EduContentsViewModel]
})
export class PagesEduContentsModule {}
