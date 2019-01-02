import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { OverviewAreaWithResultsComponent } from './components/overview-areas-with-results/overview-area-with-results.component';
import { ReportsViewModel } from './components/reports.viewmodel';
import { ResultsByPersonAndAreaComponent } from './components/results-by-person-and-area/results-by-person-and-area.component';
import { PagesReportsRoutingModule } from './pages-reports-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesReportsRoutingModule,
    UiModule,
    MatIconModule,
    PagesSharedModule,
    SharedModule
  ],
  declarations: [OverviewAreaWithResultsComponent, ResultsByPersonAndAreaComponent],
  providers: [ReportsViewModel],
  exports: [ResultsByPersonAndAreaComponent]
})
export class PagesReportsModule {}
