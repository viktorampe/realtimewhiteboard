import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Component, HostBinding, Input } from '@angular/core';
import { BadgePersonInterface } from '../person-badge/person-badge.component';
import { HumanDateTimePipe } from '../utils/pipes/human-date-time/human-date-time.pipe';

export interface NotificationItemInterface {
  icon: string;
  person?: BadgePersonInterface;
  titleText: string;
  link: string;
  notificationText?: string;
  notificationDate: Date;
  accented?: boolean;
  read?: boolean;
}
@Component({
  selector: 'campus-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [HumanDateTimePipe]
})
export class NotificationComponent {
  private mobile: boolean;

  @Input() icon: string;
  @Input() person: BadgePersonInterface;
  @Input() titleText: string;
  @Input() link: string;
  @Input() notificationText: string;
  @Input() notificationDate: Date;
  @Input() accented: boolean;
  @Input() read = true;

  @HostBinding('class.ui-notification')
  private isNotification = true;
  @HostBinding('class.ui-notification--accent')
  get isAccented() {
    return this.accented;
  }
  @HostBinding('class.ui-notification--mobile')
  get isMobile() {
    return this.mobile;
  }
  @HostBinding('class.ui-notification--unread')
  get isUnread() {
    return !this.read;
  }

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => (this.mobile = state.matches));
  }
}
