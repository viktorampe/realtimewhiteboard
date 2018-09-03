import { AlertsViewModel } from './components/alerts.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesAlertsRoutingModule } from './pages-alerts-routing.module';
import { AlertsComponent } from './components/alerts.component';

@NgModule({
  imports: [CommonModule, PagesAlertsRoutingModule],
  declarations: [AlertsComponent],

  providers: [AlertsViewModel]
})
export class PagesAlertsModule {}
