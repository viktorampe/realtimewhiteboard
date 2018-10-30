import { Component, Input } from '@angular/core';
import { BadgePersonInterface } from '../person-badge/person-badge.component';

@Component({
  selector: 'campus-notification-dropdown-item',
  templateUrl: './notification-dropdown-item.component.html',
  styleUrls: ['./notification-dropdown-item.component.scss']
})
export class NotificationDropdownItemComponent {
  @Input() icon: string;
  @Input() person: BadgePersonInterface;
  @Input() titleText: string;
  @Input() link: string;
  @Input() notificationText: string;
  @Input() notificationDate: string;
  @Input() accented: boolean;
}
