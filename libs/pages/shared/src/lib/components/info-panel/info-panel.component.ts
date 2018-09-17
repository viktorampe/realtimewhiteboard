import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {
  @Input() titleText: string;
  @Input() displayName: string;
  @Input() name: string;
  @Input() description: string;
}
