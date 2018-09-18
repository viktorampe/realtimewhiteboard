import { Component, Input } from '@angular/core';

/**
 * @example
 * <campus-person-badge person
                       [displayName]="'Tom Mertens'"
                       [orientation]="'left'"
                       [size]="'medium'"></campus-person-badge>
 * 
 * @export
 * @class PersonBadgeComponent
 */
@Component({
  selector: 'campus-person-badge',
  templateUrl: './person-badge.component.html',
  styleUrls: ['./person-badge.component.scss']
})
export class PersonBadgeComponent {
  @Input() align: string;
  @Input() size: string;
  @Input() displayName: string;
}
