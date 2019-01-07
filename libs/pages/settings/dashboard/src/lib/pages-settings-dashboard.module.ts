import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SettingsDashboardComponent } from './settings-dashboard/components/settings-dashboard.component';

@NgModule({
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
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
