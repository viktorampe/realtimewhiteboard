import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportsComponent } from './components/reports.component';
import { ReportsViewModel } from './components/reports.viewmodel';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, ReportsRoutingModule],
  exports: [],
  providers: [ReportsViewModel]
})
export class ReportsModule {}
