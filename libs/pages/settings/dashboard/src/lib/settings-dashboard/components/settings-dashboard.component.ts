import { Component } from '@angular/core';
import { NavItem } from '@campus/ui';
import { Observable } from 'rxjs';
import { SettingsDashboardViewModel } from './settings-dashboard.viewmodel';

@Component({
  selector: 'campus-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent {
  links$: Observable<NavItem[]> = this.viewModel.links$;
  useNavItemStyle: boolean = this.viewModel.environmentUi.useNavItemStyle;

  constructor(private viewModel: SettingsDashboardViewModel) {}
}
