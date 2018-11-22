import { Component, OnInit } from '@angular/core';
import { MockHeaderViewModel } from './header.viewmodel.mock';

@Component({
  selector: 'campus-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  enableAlerts: boolean;

  breadCrumbs$ = this.headerViewModel.breadCrumbs$;
  recentAlerts$ = this.headerViewModel.recentAlerts$;
  recentAlertCount$ = this.headerViewModel.recentAlertCount$;
  backLink$ = this.headerViewModel.backLink$;

  constructor(private headerViewModel: MockHeaderViewModel) {}

  ngOnInit(): void {
    this.loadFeatureToggles();
  }

  private loadFeatureToggles() {
    this.enableAlerts = this.headerViewModel.enableAlerts;
  }

  onMenuClick() {
    this.headerViewModel.toggleSideNav();
  }
}
