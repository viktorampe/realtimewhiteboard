import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { ReportsComponent } from './components/reports.component';
import { ReportsViewModel } from './components/reports.viewmodel';
import { PagesReportsRoutingModule } from './pages-reports-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesReportsRoutingModule,
    UiModule,
    MatIconModule,
    SharedModule
  ],
  declarations: [ReportsComponent],

  providers: [ReportsViewModel]
})
export class PagesReportsModule {}
