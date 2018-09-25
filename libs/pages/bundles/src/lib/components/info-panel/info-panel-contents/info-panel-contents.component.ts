import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-contents',
  templateUrl: './info-panel-contents.component.html',
  styleUrls: ['./info-panel-contents.component.scss']
})
export class InfoPanelContentsComponent {
  @Input()
  contents: { text: string; count?: number; editable?: boolean; data?: any }[];
}
