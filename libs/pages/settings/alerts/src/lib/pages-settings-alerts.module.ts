import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertsComponent } from './components/alerts/alerts.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: AlertsComponent }
    ])
  ],
  declarations: [AlertsComponent]
})
export class PagesSettingsAlertsModule {}
