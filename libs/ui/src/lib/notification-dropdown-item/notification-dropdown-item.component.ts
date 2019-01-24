import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  mobile?: boolean;
}
@Component({
  selector: 'campus-notification-dropdown-item',
  templateUrl: './notification-dropdown-item.component.html',
  styleUrls: ['./notification-dropdown-item.component.scss'],
  providers: [HumanDateTimePipe]
})
export class NotificationDropdownItemComponent {
  public isSmall$: Observable<boolean>;

  @Input() icon: string;
  @Input() person: BadgePersonInterface;
  @Input() titleText: string;
  @Input() link: string;
  @Input() notificationText: string;
  @Input() notificationDate: Date;
  @Input() accented: boolean;
  @Input() read = true;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isSmall$ = this.breakpointObserver
      .observe(Breakpoints.Small)
      .pipe(map((state: BreakpointState) => state.matches));
  }
}
