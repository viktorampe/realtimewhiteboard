import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-educontents',
  templateUrl: './info-panel-educontents.component.html',
  styleUrls: ['./info-panel-educontents.component.scss']
})
export class InfoPanelEducontentsComponent {
  @Input() contents: { text: string; count?: number; editable?: boolean; data?: any }[];
}
