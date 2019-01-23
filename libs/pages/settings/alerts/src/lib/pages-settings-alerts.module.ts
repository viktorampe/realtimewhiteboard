import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AlertsResolver } from './components/alerts/alerts.resolver';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AlertsComponent,
        resolve: { isResolved: AlertsResolver }
      }
    ])
  ],
  declarations: [AlertsComponent]
})
export class PagesSettingsAlertsModule {}
