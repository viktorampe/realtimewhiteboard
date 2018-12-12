import { ReportsViewModel } from './components/reports.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesReportsRoutingModule } from './pages-reports-routing.module';
import { ReportsComponent } from './components/reports.component';
import { ResultsByPersonAndAreaComponent } from './components/results-by-person-and-area/results-by-person-and-area.component';

@NgModule({
  imports: [CommonModule, PagesReportsRoutingModule],
  declarations: [ReportsComponent, ResultsByPersonAndAreaComponent],

  providers: [ReportsViewModel],

  exports: [ResultsByPersonAndAreaComponent]
})
export class PagesReportsModule {}
