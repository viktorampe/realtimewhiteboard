import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-person-badge',
  templateUrl: './person-badge.component.html',
  styleUrls: ['./person-badge.component.scss']
})
export class PersonBadgeComponent {
  @Input() orientation: string;
  @Input() size: string;
  @Input() displayName: string;
}
