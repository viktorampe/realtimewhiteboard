import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-person-summary',
  templateUrl: './person-summary.component.html',
  styleUrls: ['./person-summary.component.scss']
})
export class PersonSummaryComponent {
  @Input() name = '';
  @Input() imageUrl = 'assets/images/avatar.png';
  @Input() connectionTypeIcon = '';
}
