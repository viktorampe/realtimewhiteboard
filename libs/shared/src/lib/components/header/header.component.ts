import { Component, Input, OnInit } from '@angular/core';
import { Permissions } from '@campus/dal';
import { map } from 'rxjs/operators';
import { AlertToNotificationItemPipe } from '../../pipes/alert-to-notification/alert-to-notification-pipe';
import { QuickLinkTypeEnum } from '../quick-link/quick-link-type.enum';
import { HeaderViewModel } from './header.viewmodel';

@Component({
  selector: 'campus-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  Permissions = Permissions.settings;

  enableAlerts: boolean;
  enableGlobalSearch: boolean;

  @Input()
  breadcrumbPosition: 'top-left' | 'page-left';
  @Input()
  profileMenuPosition: 'top-right';
  @Input()
  quicklinkPosition: 'page-right' | 'top-right';
  @Input()
  alertsPosition: 'top-right';
  @Input()
  profileLinkPosition: 'top-right';

  profileMenuItems$ = this.headerViewModel.profileMenuItems$;
  alertsLoaded$ = this.headerViewModel.alertsLoaded$;
  breadCrumbs$ = this.headerViewModel.breadCrumbs$;
  alertNotifications$;
  unreadAlertCount$ = this.headerViewModel.unreadAlertCount$;
  backLink$ = this.headerViewModel.backLink$;
  currentUser$ = this.headerViewModel.currentUser$;

  constructor(
    private headerViewModel: HeaderViewModel,
    private alertToNotif: AlertToNotificationItemPipe
  ) {
    this.alertNotifications$ = this.headerViewModel.alertNotifications$.pipe(
      map(a => a.map(this.alertToNotif.transform))
    );
  }

  ngOnInit(): void {
    this.loadFeatureToggles();
  }

  private loadFeatureToggles() {
    this.enableAlerts = this.headerViewModel.enableAlerts;
    this.enableGlobalSearch = this.headerViewModel.enableGlobalSearch;
  }

  onMenuClick() {
    this.headerViewModel.toggleSideNav();
  }

  onManageFavoritesClick(): void {
    this.headerViewModel.openDialog(QuickLinkTypeEnum.FAVORITES);
  }

  onManageHistoryClick(): void {
    this.headerViewModel.openDialog(QuickLinkTypeEnum.HISTORY);
  }
}
