import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { BookLessonsComponent } from './components/book-lessons/book-lessons.component';
import { ManagePracticeMethodDetailComponent } from './components/manage-practice-method-detail/manage-practice-method-detail.component';
import { ManagePracticeOverviewComponent } from './components/manage-practice-overview/manage-practice-overview.component';
import { PracticeBookChaptersComponent } from './components/practice-book-chapters/practice-book-chapters.component';
import { PracticeOverviewComponent } from './components/practice-overview/practice-overview.component';
import { PracticeViewModel } from './components/practice.viewmodel';
import { PagesPracticeRoutingModule } from './pages-practice-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesPracticeRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule,
    GuardsModule
  ],
  declarations: [
    ManagePracticeOverviewComponent,
    ManagePracticeMethodDetailComponent,
    PracticeOverviewComponent,
    PracticeBookChaptersComponent,
    BookLessonsComponent
  ],
  providers: [PracticeViewModel],
  exports: []
})
export class PagesPracticeModule {}
