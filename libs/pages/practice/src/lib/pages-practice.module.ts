import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GuardsModule } from '@campus/guards';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { ManagePracticeMethodDetailComponent } from './components/manage-practice-method-detail/manage-practice-method-detail.component';
import { ManagePracticeOverviewComponent } from './components/manage-practice-overview/manage-practice-overview.component';
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
    PracticeOverviewComponent
  ],
  providers: [PracticeViewModel],
  exports: []
})
export class PagesPracticeModule {}
