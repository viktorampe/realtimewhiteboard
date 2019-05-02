import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AlertsResolver } from './components/alerts/alerts.resolver';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UiModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: AlertsComponent,
        resolve: { isResolved: AlertsResolver },
        runGuardsAndResolvers: 'always'
      }
    ])
  ],
  declarations: [AlertsComponent]
})
export class PagesSettingsAlertsModule {}
