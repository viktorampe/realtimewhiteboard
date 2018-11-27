import { Component, OnInit } from '@angular/core';
import { HeaderViewModel } from './header.viewmodel';

@Component({
  selector: 'campus-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  enableAlerts: boolean;

  profileMenuItems$ = this.headerViewModel.profileMenuItems$;
  isResolved$ = this.headerViewModel.isResolved$;
  breadCrumbs$ = this.headerViewModel.breadCrumbs$;
  alertNotifications$ = this.headerViewModel.alertNotifications$;
  unreadAlertCount$ = this.headerViewModel.unreadAlertCount$;
  backLink$ = this.headerViewModel.backLink$;
  currentUser$ = this.headerViewModel.currentUser$;

  constructor(private headerViewModel: HeaderViewModel) {}

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
