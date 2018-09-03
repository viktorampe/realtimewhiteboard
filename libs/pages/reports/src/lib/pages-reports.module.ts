import { ReportsViewModel } from './components/reports.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesReportsRoutingModule } from './pages-reports-routing.module';
import { ReportsComponent } from './components/reports.component';

@NgModule({
  imports: [CommonModule, PagesReportsRoutingModule],
  declarations: [ReportsComponent],

  providers: [ReportsViewModel]
})
export class PagesReportsModule {}
