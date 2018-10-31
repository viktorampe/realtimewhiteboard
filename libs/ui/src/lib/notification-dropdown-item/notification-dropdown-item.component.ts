import { Component, Input } from '@angular/core';
import { BadgePersonInterface } from '../person-badge/person-badge.component';
import { HumanDateTimePipe } from '../utils/pipes/human-date-time/human-date-time.pipe';

@Component({
  selector: 'campus-notification-dropdown-item',
  templateUrl: './notification-dropdown-item.component.html',
  styleUrls: ['./notification-dropdown-item.component.scss'],
  providers: [HumanDateTimePipe]
})
export class NotificationDropdownItemComponent {
  @Input() icon: string;
  @Input() person: BadgePersonInterface;
  @Input() titleText: string;
  @Input() link: string;
  @Input() notificationText: string;
  @Input() notificationDate: Date;
  @Input() accented: boolean;
}
