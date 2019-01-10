import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Link,
  SettingsDashboardViewModel
} from './settings-dashboard.viewmodel';

@Component({
  selector: 'campus-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.scss']
})
export class SettingsDashboardComponent {
  links: Observable<Link[]> = this.viewModel.links;

  constructor(private viewModel: SettingsDashboardViewModel) {}
}
