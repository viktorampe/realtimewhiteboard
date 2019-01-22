import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { AlertsComponent } from './components/alerts/alerts.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: AlertsComponent }
    ])
  ],
  declarations: [AlertsComponent]
})
export class PagesSettingsAlertsModule {}
