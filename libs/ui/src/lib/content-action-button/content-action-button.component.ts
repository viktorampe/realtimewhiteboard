import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-content-action-button',
  templateUrl: './content-action-button.component.html',
  styleUrls: ['./content-action-button.component.scss']
})
export class ContentActionButtonComponent {
  @Input() iconClass: string;
  @Input() tooltip: string;
}
