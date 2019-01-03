import { Injectable } from '@angular/core';
import { ViewModelInterface } from '@campus/testing';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockSettingsDashboardViewModel
  implements ViewModelInterface<SettingsDashboardViewModel> {}
