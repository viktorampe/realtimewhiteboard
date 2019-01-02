import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsDashboardComponent } from './settings-dashboard/settings-dashboard.component';

@NgModule({
  imports: [
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
