import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { SettingsDashboardComponent } from './settings-dashboard/components/settings-dashboard.component';

@NgModule({
  imports: [
    MatListModule,
    UiModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsDashboardComponent
      }
    ])
  ],
  declarations: [SettingsDashboardComponent]
})
export class PagesSettingsDashboardModule {}
