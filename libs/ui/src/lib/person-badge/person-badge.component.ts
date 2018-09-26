import { Component, Input } from '@angular/core';

/**
 * @example
 * <campus-person-badge person
                       [person]="'Tom Mertens'"
                       [align]="'left'"
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
  @Input() align = 'left';
  @Input() size = 'medium';
  @Input() person: BadgePerson;
}


export interface BadgePerson {
  displayName: string,
  name?: string,
  firstName?: string,
  avatar?: string
}