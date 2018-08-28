import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './components/alerts.component';
import { AlertsViewModel } from './components/alerts.viewmodel';

@NgModule({
  declarations: [AlertsComponent],
  imports: [CommonModule, AlertsRoutingModule],
  exports: [],
  providers: [AlertsViewModel]
})
export class AlertsModule {}
