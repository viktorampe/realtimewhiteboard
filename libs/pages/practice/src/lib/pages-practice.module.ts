import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { PracticeOverviewComponent } from './components/practice-overview/practice-overview.component';
import { PracticeComponent } from './components/practice.component';
import { PracticeViewModel } from './components/practice.viewmodel';
import { PagesPracticeRoutingModule } from './pages-practice-routing.module';
@NgModule({
  imports: [
    CommonModule,
    PagesPracticeRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule
  ],
  declarations: [PracticeOverviewComponent, PracticeComponent],
  providers: [PracticeViewModel],
  exports: []
})
export class PagesPracticeModule {}
