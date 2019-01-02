import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { ReportsComponent } from './components/reports.component';
import { ReportsViewModel } from './components/reports.viewmodel';
import { ResultsByPersonAndAreaComponent } from './components/results-by-person-and-area/results-by-person-and-area.component';
import { PagesReportsRoutingModule } from './pages-reports-routing.module';

@NgModule({
  imports: [CommonModule, PagesReportsRoutingModule, UiModule],
  declarations: [ReportsComponent, ResultsByPersonAndAreaComponent],

  providers: [ReportsViewModel],

  exports: [ResultsByPersonAndAreaComponent]
})
export class PagesReportsModule {}
